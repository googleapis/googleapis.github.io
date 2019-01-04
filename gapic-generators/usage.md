# Running [GAPIC Generators](/gapic-generators)

## GAPIC generators are `protoc` plugins.

GAPIC generators are plugins to `protoc`, the Protocol Buffer compiler, and use
the standard plugin interface of `protoc`. As a result, every GAPIC generator
can be run using an invocation like this:

`protoc --{language}_gapic_out={path} {other protoc options} {.proto source files}`

When GAPIC generators support options, option values can be passed using the
`--{language}_gapic_opt` flag of `protoc`.

For example, the Go GAPIC generator accepts an option that specifies the package
name to use for generated code. It can be specified using the following flag:
`--go_gapic_opt "go-gapic-package=GO_PACKAGE_VALUE"`

## GAPIC generators are available in Docker images.

Running GAPIC generators can require some nontrivial installation and setup. It
requires an appropriate version of `protoc` and any runtime dependencies of the
GAPIC generator, for example a Python interpreter or a Java virtual machine.
Generally each GAPIC generator will have its own dependencies and these will
rarely overlap with the dependencies of other generators.

To relieve this burden, GAPIC generators are published in Docker images that
encapsulate `protoc`, a generator, and all of the generator's runtime
dependencies. These Docker images are generally dedicated to a single language.

By convention, a generator in a Docker image is run using the following command:

```
$ docker run \--rm \--user \$UID \
  --mount type=bind,source=a/b/c/v1/,destination=/in/a/b/c/v1/,readonly \
  --mount type=bind,source=dest/,destination=/out/ \
  gcr.io/gapic-images/{GENERATOR} \
  [additional options]
```

If a generator requires additional arguments (e.g. the Go GAPIC package
argument), these should be added as arguments at the end (the last line in the
example above), and the Docker entrypoint will route them to the appropriate
`--{lang}\_gapic_opt` arguments.

## Official GAPIC generator images are published in the Google Container Registry.

Images for officially-supported generators are published in
`gcr.io/gapic-images`, a dedicated project in Google Container Registry. The
naming scheme for a generator is: `gcr.io/gapic-images/gapic-generator-{lang}`

For each generator, continuous integration is configured to push a new Docker
image to GCR when releases are made. When a release is tagged in GitHub (with a
version number, such as 1.0.3), a CI service should build an image based on the
code at that tag.

The resulting image should be tagged with each component of the version number,
as well as latest, and the resulting tags pushed to GCR. This means that a
release tag of 1.0.3 in GitHub would result in pushing the following four tags
to GCR:

- `gcr.io/gapic-images/gapic-generator-{lang}:1`
- `gcr.io/gapic-images/gapic-generator-{lang}:1.0`
- `gcr.io/gapic-images/gapic-generator-{lang}:1.0.3`
- `gcr.io/gapic-images/gapic-generator-{lang}:latest`
