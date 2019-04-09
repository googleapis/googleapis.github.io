## Google APIs

The [googleapis](https://github.com/googleapis) organization hosts tools,
technical articles, and issues related to Google API design and practice. It
also hosts client libraries for using many Google APIs from a variety of
supported languages.

Here we use [Google APIs](https://github.com/googleapis/googleapis) to refer to
networked APIs provided by Google services. Google APIs are developed as RPC
API services defined using
[Protocol Buffers](https://developers.google.com/protocol-buffers/). These RPC
APIs are published directly as [gRPC](https://grpc.io/) services and are made
available as
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) APIs
using
[gRPC-HTTP/JSON Transcoding](https://cloud.google.com/endpoints/docs/grpc/transcoding).
Most Google APIs are hosted on the `googleapis.com` domain, and Google API
specifications are published in 
[github.com/googleapis/googleapis](https://github.com/googleapis/googleapis). External
developers can use the published proto files to generate documentation and
client libraries or to guide their own API definitions.

### API Design Guide

Google APIs use a common
[API Design Guide](https://cloud.google.com/apis/design) that encourages a
simple and consistent API design philosophy. It also provides solutions to
common design issues, such as proper default values for enums and patterns for
long-running operations.

### How to Call Google APIs

The easiest way to call a Google API is with a
[Google Cloud Client Library](https://cloud.google.com/apis/docs/cloud-client-libraries):

- [Go](https://github.com/googleapis/google-cloud-go)
- [Java](https://github.com/googleapis/google-cloud-java)
- [Node.js](https://github.com/googleapis/google-cloud-node)
- [Python](https://github.com/googleapis/google-cloud-python)
- [Ruby](https://github.com/googleapis/google-cloud-ruby)
- [PHP](https://github.com/googleapis/google-cloud-php)
- [C#](https://github.com/googleapis/google-cloud-dotnet)

All client libraries are fully open-source and are released under the Apache
License, Version 2.0.

For developers working in languages or environments that we don't support, we
provide instructions here for calling Google APIs in both
[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) and
[RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) forms:

- [How to Call Google APIs, REST edition](/HowToREST.md)

- [How to Call Google APIs, RPC edition](/HowToRPC.md)

### API Client Tools

Google's API client libraries are produced with open source tools and
automation.

#### Generated API Clients (GAPICs)

Google's newest and most powerful APIs are built with [gRPC](https://grpc.io),
an open-source RPC framework that grew from technologies developed at Google.
Many of the client libraries that we publish for these APIs are automatically
generated from API descriptions written in the
[Protocol Buffers](https://developers.google.com/protocol-buffers/) language.
All of our generators and related tools are open source and hosted in the
[googleapis](https://github.com/googleapis) organization. To learn more about
them, see [gapic-generators](/gapic-generators).

The [googleapis](https://github.com/googleapis) organization also hosts
repositories that contain common code used by Google's generated and
handwritten client libraries. Details vary by language, but most provide
support for generally-needed features like paging and retry. Currently there is
one such library for each of the main languages that we support:
[gax-dotnet](https://github.com/googleapis/gax-dotnet),
[gax-go](https://github.com/googleapis/gax-go),
[gax-java](https://github.com/googleapis/gax-java),
[gax-nodejs](https://github.com/googleapis/gax-nodejs),
[gax-php](https://github.com/googleapis/gax-php),
[gax-python](https://github.com/googleapis/gax-python), and
[gax-ruby](https://github.com/googleapis/gax-ruby). Note that we consider these
to be internal implementation details of our clients and reserve the right to
make changes, so if you choose to use them, be sure to refer to tagged
versions.

#### The API Discovery Format

Before gRPC, Google APIs were published primarily as REST APIs and described
with the
[Google API Discovery Service](https://developers.google.com/discovery/). Now
via
[gRPC-HTTP/JSON Transcoding](https://cloud.google.com/endpoints/docs/grpc/transcoding),
many of Google's gRPC APIs are also available as HTTP/JSON APIs and described
by the API Discovery Service. These HTTP/JSON APIs have been supported by a
previous generation of client libraries and code generators based on the API
Discovery Service. Google API support teams published support for several
programming languages
([Java](https://developers.google.com/api-client-library/java/apis/discovery/v1),
[Python](https://developers.google.com/api-client-library/python/),
[PHP](https://developers.google.com/api-client-library/php/),
[.NET](https://developers.google.com/api-client-library/dotnet/),
[Javascript](https://developers.google.com/api-client-library/javascript/),
[Ruby](https://developers.google.com/api-client-library/ruby/),
[Go](https://github.com/googleapis/google-api-go-client),
[Node.js](https://github.com/googleapis/google-api-nodejs-client), and
[Objective-C](https://github.com/google/google-api-objectivec-client-for-rest/)).
We also currently have experimental support for
[Swift](https://github.com/googleapis/google-api-swift-client). Support for
other languages has been developed by external developers
([Rust](https://github.com/Byron/google-apis-rs)) and other groups within
Google ([Dart](https://github.com/dart-lang/discoveryapis_generator)).

Currently, we are not aware of any other API provider using the API Discovery
Format. In contrast, a large community of API producers and consumers has grown
around the
[OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification) (formerly
known as [Swagger](https://swagger.io)), with many community tools emerging for
working with OpenAPI descriptions of REST APIs.

#### OpenAPI

We recommend using OpenAPI and OpenAPI-based tools for working with Google's
REST APIs. Several tools for converting Google Discovery Format to OpenAPI have
been published:

- [google-discovery-to-swagger](https://github.com/APIs-guru/google-discovery-to-swagger),
  an MIT-licensed open source script for converting Google Discovery format
  into Swagger 2.0.
- [API Spec Converter](https://lucybot-inc.github.io/api-spec-converter/), an
  online converter from [LucyBot](https://lucybot.com/).
- [The API Transformer](https://www.apimatic.io/transformer) from
  [APIMatic](https://www.apimatic.io).

Google's OpenAPI tools include
[gnostic](https://github.com/googleapis/gnostic), a front-end for OpenAPI tools
that reads OpenAPI descriptions, puts them in an efficient binary
representation, and allows efficient plugins and standalone tools to be easily
written in any programming language with Protocol Buffer support.

### Issues

If you have feedback or questions regarding API design or methodology, please
file an issue in the
[googleapis.github.io issues area](https://github.com/googleapis/googleapis.github.io/issues).
For specific tool questions, please file an issue on the corresponding
repository. We look forward to hearing from you!
