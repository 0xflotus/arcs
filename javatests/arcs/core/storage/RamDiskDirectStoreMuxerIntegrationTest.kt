/*
 * Copyright 2019 Google LLC.
 *
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 *
 * Code distributed by Google as part of this project is also subject to an additional IP rights
 * grant found at
 * http://polymer.github.io/PATENTS.txt
 */

package arcs.core.storage

import arcs.core.crdt.CrdtCount
import arcs.core.crdt.CrdtCount.Operation.Increment
import arcs.core.crdt.CrdtCount.Operation.MultiIncrement
import arcs.core.crdt.CrdtData
import arcs.core.crdt.CrdtModel
import arcs.core.crdt.CrdtOperation
import arcs.core.data.CountType
import arcs.core.storage.driver.RamDisk
import arcs.core.storage.driver.RamDiskDriverProvider
import arcs.core.storage.keys.RamDiskStorageKey
import com.google.common.truth.Truth.assertThat
import com.google.common.truth.Truth.assertWithMessage
import kotlinx.atomicfu.atomic
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.Job
import kotlinx.coroutines.test.runBlockingTest
import org.junit.After
import org.junit.Assert.fail
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

/** Tests for [RamDiskDriver] coupled with [DirectStoreMuxer]. */
@ExperimentalCoroutinesApi
@RunWith(JUnit4::class)
class RamDiskDirectStoreMuxerIntegrationTest {
    private lateinit var ramDiskProvider: DriverProvider

    @Before
    fun setup() {
        ramDiskProvider = RamDiskDriverProvider()
    }

    @After
    fun teardown() {
        RamDisk.clear()
        DriverFactory.clearRegistrations()
    }

    @Suppress("UNCHECKED_CAST")
    @Test
    fun allowsStorageOf_aNumberOfObjects() = runBlockingTest {
        val message = atomic<ProxyMessage<CrdtCount.Data, CrdtCount.Operation, Int>?>(null)
        val muxId = atomic<String?>(null)
        var job = Job()

        val storageKey = RamDiskStorageKey("unique")
        val store = DirectStoreMuxer<CrdtData, CrdtOperation, Any?>(
            storageKey = storageKey,
            backingType = CountType(),
            callbackFactory = { eventId ->
                ProxyCallback { m ->
                    message.value = m as ProxyMessage<CrdtCount.Data, CrdtCount.Operation, Int>
                    muxId.value = eventId
                    job.complete()
                }
            }
        )


        val count1 = CrdtCount()
        count1.applyOperation(Increment("me", version = 0 to 1))

        val count2 = CrdtCount()
        count2.applyOperation(MultiIncrement("them", version = 0 to 10, delta = 15))

        assertThat(
            store.onProxyMessage(ProxyMessage.ModelUpdate(count1.data, null), "thing0")
        ).isTrue()
        assertThat(
            store.onProxyMessage(ProxyMessage.ModelUpdate(count2.data, null), "thing1")
        ).isTrue()

        store.idle()

        store.onProxyMessage(ProxyMessage.SyncRequest(null), "thing0")
        job.join()
        message.value.assertHasData(count1)
        assertThat(muxId.value ?: "huh, it was null.").isEqualTo("thing0")

        message.value = null
        muxId.value = null
        job = Job()
        store.onProxyMessage(ProxyMessage.SyncRequest(null), "thing1")
        job.join()
        message.value.assertHasData(count2)
        assertThat(muxId.value ?: "huh, it was null.").isEqualTo("thing1")

        message.value = null
        muxId.value = null
        job = Job()
        store.onProxyMessage(ProxyMessage.SyncRequest(null), "not-a-thing")
        job.join()
        message.value.assertHasData(CrdtCount())
        assertThat(muxId.value ?: "huh, it was null.").isEqualTo("not-a-thing")
    }

    private fun <Data, Op, ConsumerData> ProxyMessage<Data, Op, ConsumerData>?.assertHasData(
        expectedModel: CrdtModel<Data, Op, ConsumerData>
    ) where Data : CrdtData, Op : CrdtOperation {
        assertWithMessage("Message must be initialized.").that(this).isNotNull()
        when (this) {
            is ProxyMessage.ModelUpdate -> assertThat(model).isEqualTo(expectedModel.data)
            else -> fail("Message $this is not a ModelUpdate")
        }
    }
}
