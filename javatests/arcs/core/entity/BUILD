load(
    "//third_party/java/arcs/build_defs:build_defs.bzl",
    "arcs_kt_jvm_library",
    "arcs_kt_jvm_test_suite",
    "arcs_kt_schema",
)

licenses(["notice"])

TEST_SRCS = glob(["*Test.kt"])

arcs_kt_schema(
    name = "test_arcs_gen",
    srcs = ["test.arcs"],
)

arcs_kt_jvm_test_suite(
    name = "entity",
    srcs = TEST_SRCS,
    package = "arcs.core.entity",
    deps = [
        ":lib",
        "//java/arcs/core/common",
        "//java/arcs/core/crdt",
        "//java/arcs/core/data",
        "//java/arcs/core/data:schema_fields",
        "//java/arcs/core/data/util:data-util",
        "//java/arcs/core/entity",
        "//java/arcs/core/host",
        "//java/arcs/core/storage",
        "//java/arcs/core/storage/api",
        "//java/arcs/core/storage/driver",
        "//java/arcs/core/storage/driver/testutil",
        "//java/arcs/core/storage/keys",
        "//java/arcs/core/storage/referencemode",
        "//java/arcs/core/storage/testutil",
        "//java/arcs/core/testutil",
        "//java/arcs/core/testutil/handles",
        "//java/arcs/core/util",
        "//java/arcs/core/util/testutil",
        "//java/arcs/jvm/host",
        "//java/arcs/jvm/util/testutil",
        "//third_party/java/junit:junit-android",
        "//third_party/java/truth:truth-android",
        "//third_party/kotlin/kotlin:kotlin_test",
        "//third_party/kotlin/kotlinx_coroutines",
        "//third_party/kotlin/kotlinx_coroutines:kotlinx_coroutines_test",
    ],
)

arcs_kt_jvm_library(
    name = "lib",
    testonly = 1,
    srcs = glob(
        ["*.kt"],
        exclude = TEST_SRCS,
    ),
    visibility = ["//javatests/arcs:__subpackages__"],
    deps = [
        ":test_arcs_gen",
        "//java/arcs/core/common",
        "//java/arcs/core/crdt",
        "//java/arcs/core/data",
        "//java/arcs/core/data:schema_fields",
        "//java/arcs/core/data/util:data-util",
        "//java/arcs/core/entity",
        "//java/arcs/core/host",
        "//java/arcs/core/storage",
        "//java/arcs/core/storage/api",
        "//java/arcs/core/storage/driver",
        "//java/arcs/core/storage/driver/testutil",
        "//java/arcs/core/storage/keys",
        "//java/arcs/core/storage/referencemode",
        "//java/arcs/core/testutil",
        "//java/arcs/core/testutil/handles",
        "//java/arcs/core/util",
        "//java/arcs/core/util/testutil",
        "//java/arcs/jvm/host",
        "//java/arcs/jvm/util/testutil",
        "//third_party/java/junit:junit-android",
        "//third_party/java/truth:truth-android",
        "//third_party/kotlin/kotlinx_coroutines",
        "//third_party/kotlin/kotlinx_coroutines:kotlinx_coroutines_test",
    ],
)
