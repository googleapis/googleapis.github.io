# Google APIs

The [googleapis](https://github.com/googleapis) organization hosts tools, 
technical articles, and issues related to API practice at Google.

### About Google APIs

[Google APIs](https://github.com/googleapis/googleapis)
refers to networked APIs provided by Google services.
Most Google APIs are hosted on the `googleapis.com` domain,
and most services provide
both [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
and [gRPC](https://grpc.io/) APIs using
[transcoding](https://github.com/googleapis/googleapis/blob/master/google/api/http.proto).

Google APIs are developed as RPC services defined using the
[Protocol Buffer language](https://developers.google.com/protocol-buffers/)
(a.k.a. "proto"). API specifications are published in the
[Google APIs](https://github.com/googleapis/googleapis) repository.
External developers can use the published proto files to generate documentation and
client libraries or to guide their own API definitions.

### API Design Guide

To provide great developer experience, Google APIs use a common
[API Design Guide](https://cloud.google.com/apis/design)
that encourages a simple and consistent API design philosophy.
It also provides solutions to common design issues,
such as proper default values for enums and 
patterns for long-running operations.

### API Client Tools

Many Google APIs are supported by client libraries that developers can use to
more easily call Google's gRPC and REST APIs. Many of these libraries are
generated using [toolkit](https://github.com/googleapis/toolkit) and
[artman](https://github.com/googleapis/artman).

We are also building tools that work with the
[OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)
for REST APIs. [gnostic](https://github.com/googleapis/gnostic)
is an extensible front-end for OpenAPI tools that reads OpenAPI
descriptions, puts them in an efficient binary representation,
and allows efficient plugins and standalone tools to be easily written
in any programming language with Protocol Buffer support. 

### Feedback and Questions

If you have feedback or questions regarding API design or methodology,
please [file an issue here](https://github.com/googleapis/googleapis.github.io/issues).
For specific tool questions, please file an issue on the corresponding
repository. We look forward to hearing from you!
