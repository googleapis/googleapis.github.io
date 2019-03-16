## Google APIs

The [googleapis](https://github.com/googleapis) organization hosts tools,
technical articles, and issues related to Google API design and practice.

### About Google APIs

[Google APIs](https://github.com/googleapis/googleapis) refers to networked APIs
provided by Google services. Most Google APIs are hosted on the `googleapis.com`
domain, and support both
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) and
[gRPC](https://grpc.io/) APIs using
[transcoding](https://github.com/googleapis/googleapis/blob/master/google/api/http.proto).

Google APIs are developed as RPC API services defined using
[Protocol Buffers](https://developers.google.com/protocol-buffers/) (proto).
Google API specifications are published in the
[Google APIs](https://github.com/googleapis/googleapis) repository. External
developers can use the published proto files to generate documentation and
client libraries or to guide their own API definitions.

### API Design Guide

To provide great developer experience, Google APIs use a common
[API Design Guide](https://cloud.google.com/apis/design) that encourages a
simple and consistent API design philosophy. It also provides solutions to
common design issues, such as proper default values for enums and patterns for
long-running operations.

### How to Call Google APIs

The easiest way to call a Google API is with a
[Google Cloud Client Library](https://cloud.google.com/apis/docs/cloud-client-libraries).
For developers working in languages or environments that we don't currently
support, we provide instructions here for calling Google APIs in both
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) and
[RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) forms:

- [How to Call Google APIs, REST edition](/HowToREST.md)

- [How to Call Google APIs, RPC edition](/HowToRPC.md)

### API Client Tools

Many Google APIs are supported by client libraries that developers can use to
more easily call Google's gRPC and REST APIs. Many of these libraries are
generated using [toolkit](https://github.com/googleapis/toolkit) and
[artman](https://github.com/googleapis/artman).

### Google API Extensions (GAX)

The [googleapis](https://github.com/googleapis) organization also hosts
repositories that contain common code used by Google's generated and handwritten
client libraries. Details vary by language, but most provide support for
generally-needed features like paging and retry. Currently there is one such
library for each of the main languages that we support:
[gax-dotnet](https://github.com/googleapis/gax-dotnet),
[gax-go](https://github.com/googleapis/gax-go),
[gax-java](https://github.com/googleapis/gax-java),
[gax-nodejs](https://github.com/googleapis/gax-nodejs),
[gax-php](https://github.com/googleapis/gax-php),
[gax-python](https://github.com/googleapis/gax-python), and
[gax-ruby](https://github.com/googleapis/gax-ruby). Note that we consider these
to be internal implementation details of our clients and reserve the right to
make changes, so if you choose to use them, be sure to refer to tagged versions.

### OpenAPI Tools

We are also building tools that work with the
[OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification) for REST
APIs. [gnostic](https://github.com/googleapis/gnostic) is an extensible
front-end for OpenAPI tools that reads OpenAPI descriptions, puts them in an
efficient binary representation, and allows efficient plugins and standalone
tools to be easily written in any programming language with Protocol Buffer
support.

### For feedback and questions, please file an issue!

If you have feedback or questions regarding API design or methodology, please
file an issue in the
[googleapis.github.io issues area](https://github.com/googleapis/googleapis.github.io/issues).
For specific tool questions, please file an issue on the corresponding
repository. We look forward to hearing from you!
