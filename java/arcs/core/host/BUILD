load("//third_party/java/arcs/build_defs:build_defs.bzl", "arcs_kt_library")

licenses(["notice"])

package(default_visibility = ["//visibility:public"])

arcs_kt_library(
    name = "host",
    srcs = glob(["*.kt"]),
    deps = [
        "//java/arcs/core/analytics",
        "//java/arcs/core/common",
        "//java/arcs/core/crdt",
        "//java/arcs/core/data",
        "//java/arcs/core/data:rawentity",
        "//java/arcs/core/data:schema_fields",
        "//java/arcs/core/entity",
        "//java/arcs/core/host/api",
        "//java/arcs/core/host/generated:archostcontext",
        "//java/arcs/core/storage",
        "//java/arcs/core/storage:storage_key",
        "//java/arcs/core/storage/referencemode",
        "//java/arcs/core/type",
        "//java/arcs/core/util",
        "//third_party/kotlin/kotlinx_atomicfu",
        "//third_party/kotlin/kotlinx_coroutines",
    ],
)
