load(
    "//third_party/java/arcs/build_defs:build_defs.bzl",
    "arcs_kt_jvm_library",
    "arcs_kt_native_library",
    # TODO: KotlinJS crashes (https://github.com/PolymerLabs/arcs/issues/4772)
    #   "kt_js_library",
)

licenses(["notice"])

package(default_visibility = ["//visibility:public"])

arcs_kt_jvm_library(
    name = "sdk",
    srcs = glob([
        "*.kt",
        "jvm/*.kt",
    ]),
    visibility = ["//visibility:public"],
    exports = [
        "//java/arcs/core/data",
        "//java/arcs/core/data:rawentity",
        "//java/arcs/core/data:schema_fields",
        "//java/arcs/core/data/util:data-util",
        "//java/arcs/core/entity",
        "//java/arcs/core/host/api",
        "//java/arcs/core/storage:storage_key",
        "//java/arcs/core/storage/api",
    ],
    deps = [
        "//java/arcs/core/data",
        "//java/arcs/core/data/util:data-util",
        "//java/arcs/core/entity",
        "//java/arcs/core/host/api",
        "//java/arcs/core/storage:reference",
        "//java/arcs/core/storage:storage_key",
        "//java/arcs/core/storage/api",
        "//java/arcs/core/storage/util",
        "//java/arcs/sdk/storage",
        "//third_party/kotlin/kotlinx_coroutines",
        "//third_party/kotlin/kotlinx_coroutines:kotlinx_coroutines_test",
    ],
)

# TODO: Reenable after https://github.com/PolymerLabs/arcs/issues/4772 fixed.
# Temporarily disable because of Kotlin-JS compiler bug
# See https://gist.github.com/cromwellian/8b62b883ce32c3590ec93476cd7d6503
#kt_js_library(
#    name = "sdk-js",
#    srcs = glob([
#        "*.kt",
#        "js/*.kt",
#    ]),
#    deps = [
#        "//java/arcs/core/crdt:crdt-js",
#        "//java/arcs/core/data:data-js",
#        "//java/arcs/core/host:host-js",
#        "//java/arcs/core/storage:reference-js",
#        "//java/arcs/core/storage:storage_key-js",
#        "//java/arcs/core/storage/api:api-common-js",
#        "//java/arcs/sdk/storage:storage-js",
#    ],
#)

arcs_kt_native_library(
    name = "sdk-wasm",
    srcs = [
        # Don't depend on anything else from the sdk package.
        "UtilsInterface.kt",
    ] + glob([
        "wasm/*.kt",
    ]),
)

# Special package containing wasm srcs for unit testing (on the JVM).
arcs_kt_jvm_library(
    name = "sdk-wasm-testing",
    testonly = 1,
    srcs = glob(["*.kt"]) + [
        "wasm/Encoding.kt",
        "jvm/Utils.kt",
    ],
    deps = [
        "//java/arcs/core/data",
        "//java/arcs/core/host",
        "//java/arcs/core/host/api",
        "//java/arcs/core/storage/api",
        "//java/arcs/sdk",
        "//java/arcs/sdk/storage",
        "//third_party/kotlin/kotlinx_coroutines",
    ],
)
