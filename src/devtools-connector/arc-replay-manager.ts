/**
 * @license
 * Copyright (c) 2019 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import {ArcDevtoolsChannel, DevtoolsMessage} from './abstract-devtools-channel.js';
import {PECOuterPort} from '../runtime/api-channel.js';
import {PropagatedException} from '../runtime/arc-exceptions.js';
import {Arc} from '../runtime/arc.js';
import {MessagePort} from '../runtime/message-channel.js';
import {Handle} from '../runtime/recipe/handle.js';
import {Particle} from '../runtime/recipe/particle.js';
import {Content} from '../runtime/slot-consumer.js';
import {StorageProviderBase} from '../runtime/storage/storage-provider-base.js';
import {Type} from '../runtime/type.js';

export class ArcReplayManager {
  private arc: Arc;
  private host: ReplayExecutionHost;
  
  constructor(arc: Arc, arcDevtoolsChannel: ArcDevtoolsChannel) {
    this.arc = arc;
    arcDevtoolsChannel.listen('replay-start', () => this.start());
    arcDevtoolsChannel.listen('replay-step', (msg: DevtoolsMessage) => this.host.step(msg));
    arcDevtoolsChannel.listen('replay-stop', () => this.stop());
  }

  private start() {
    console.log('Replay invoked for', this.arc.id);

    const ports = this.arc.createPorts(this.arc.id);
    if (ports.length !== 1) {
      throw new Error('ArcReplayManager does not currently support more than one port')
    }
    this.host = new ReplayExecutionHost(this.arc, ports[0]);
  }

  private stop() {
    console.log('Replay stopped for', this.arc.id);
  }
}

class ReplayExecutionHost extends PECOuterPort {
  constructor(arc: Arc, port: MessagePort) {
    super(port, arc);
  }

  step(msg: DevtoolsMessage) {
    console.log('Replay step:', msg.messageBody);

    //this.apiPort.Stop();
    //this.apiPort.AwaitIdle(this.nextIdentifier++);
    //this.apiPort.UIEvent(particle, slotName, event);
    //this.apiPort.StartRender(particle, slotName, providedSlots, contentTypes);
    //this.apiPort.StopRender(particle, slotName);
    //this.apiPort.InnerArcRender(transformationParticle, transformationSlotName, hostedSlotId, content);
    //this.apiPort.DefineHandle(store, store.type.resolvedType(), name);
    //this.apiPort.InstantiateParticle(particle, particle.id.toString(), particle.spec, stores);
  }

  onRender(particle: Particle, slotName: string, content: Content) {
  }

  onInitializeProxy(handle: StorageProviderBase, callback: number) {
  }

  onSynchronizeProxy(handle: StorageProviderBase, callback: number) {
  }

  onHandleGet(handle: StorageProviderBase, callback: number) {
  }

  onHandleToList(handle: StorageProviderBase, callback: number) {
  }

  onHandleSet(handle: StorageProviderBase, data: {}, particleId: string, barrier: string) {
  }

  onHandleClear(handle: StorageProviderBase, particleId: string, barrier: string) {
  }

  onHandleStore(handle: StorageProviderBase, callback: number, data: {value: {}, keys: string[]}, particleId: string) {
  }

  onHandleRemove(handle: StorageProviderBase, callback: number, data: {id: string, keys: string[]}, particleId) {
  }

  onHandleRemoveMultiple(handle: StorageProviderBase, callback: number, data: [], particleId: string) {
  }

  onHandleStream(handle: StorageProviderBase, callback: number, pageSize: number, forward: boolean) {
  }

  onStreamCursorNext(handle: StorageProviderBase, callback: number, cursorId: number) {
  }

  onStreamCursorClose(handle: StorageProviderBase, cursorId: number) {
  }

  onIdle(version: number, relevance: Map<Particle, number[]>) {
  }

  onGetBackingStore(callback: number, storageKey: string, type: Type) {
  }

  onConstructInnerArc(callback: number, particle: Particle) {
  }

  onArcCreateHandle(callback: number, arc: Arc, type: Type, name: string) {
  }

  onArcMapHandle(callback: number, arc: Arc, handle: Handle) {
  }

  onArcCreateSlot(callback: number, arc: Arc, transformationParticle: Particle, transformationSlotName: string, handleId: string) {
  }

  onArcLoadRecipe(arc: Arc, recipe: string, callback: number) {
  }

  onReportExceptionInHost(exception: PropagatedException) {
  }

  onServiceRequest(particle: Particle, request: {}, callback: number) {
  }
}
