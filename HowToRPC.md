# How to Call Google APIs: RPC Edition

_For many developers, the easiest way to call a Google API is with one of our
[client libraries](https://cloud.google.com/apis/docs/cloud-client-libraries).
But occasionally someone may prefer to make API calls directly - perhaps from a
language or environment that we don’t support or using a different networking
library or tool. Here we’ll show you how to do it._

This page focuses on calling Google APIs directly using their underlying RPC
interfaces. Most Google APIs are also available as REST services. For that, see
[How to Call Google APIs, REST Edition](/HowToREST).

## What you’ll need

### An API definition

Most Google APIs are designed as
[RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) APIs using
[Protocol Buffers](https://developers.google.com/protocol-buffers/docs/overview).
The Protocol Buffers definitions of public Google APIs are hosted on GitHub in
the [googleapis/googleapis](https://github.com/googleapis/googleapis)
repository.

For these examples, we’ll use the
[Cloud Natural Language API](https://cloud.google.com/natural-language/), which
is defined by
[google/cloud/language/v1/language_service.proto](https://github.com/googleapis/googleapis/blob/master/google/cloud/language/v1/language_service.proto).
The RPC details are documented online in the
[Google Cloud Natural Language API reference](https://cloud.google.com/natural-language/docs/reference/rpc/).
We’ll call the
[AnalyzeEntities](https://cloud.google.com/natural-language/docs/reference/rpc/google.cloud.language.v1#google.cloud.language.v1.LanguageService.AnalyzeEntities)
API, which takes a block of text as input and returns a list of names and nouns
that it finds in the text along with some interesting properties of each
entity.

### Protocol Buffers

For all Google RPC APIs, the messages that are sent and received using the
[Protocol Buffers](https://developers.google.com/protocol-buffers/docs/overview)
encoding, and the definitive descriptions of these APIs are written in the
Protocol Buffers Language.

To compile Protocol Buffer Language files, you’ll need `protoc`, the Protocol
Buffer compiler. You can download `protoc` from the
[google/protobuf release page](https://github.com/google/protobuf/releases) on
GitHub (look for the `protoc` release for your machine architecture, e.g.
`protoc-3.6.0-linux-x86_64.zip`) or build it from source (this will take a
while).

You’ll probably also need a code generation plugin for the language that you’re
using. Plugins are standalone executables written in many different languages,
and the plugin interface is defined in the
[plugin.proto](https://github.com/google/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto)
file. Here are some plugins that we have used:

- **Go** [github.com/golang/protobuf](https://github.com/golang/protobuf)

- **Rust**
  [github.com/stepancheg/rust-protobuf](https://github.com/stepancheg/rust-protobuf)

- **Swift**
  [github.com/apple/swift-protobuf](https://github.com/apple/swift-protobuf)

For a list of Google-supported languages, see the
[Protocol Buffers API Reference](https://developers.google.com/protocol-buffers/docs/reference/overview).

### Making RPC API requests

[gRPC](https://grpc.io/) is the recommended way to call Google RPC APIs. gRPC
support is typically provided by additional `protoc` plugins that generate code
for API clients and servers. This code uses lower-level primitives that send
messages using gRPC’s HTTP/2-based messaging system, which supports request
multiplexing, streaming APIs, and advanced flow control. To learn more about
working with gRPC, visit [grpc.io/docs](https://grpc.io/docs).

If gRPC support is unavailable, Google APIs can also be called using HTTP/1.1
or later using the fallback protocol described in the next section.

### Authentication

To use Google APIs, a client needs to authenticate with an API key or an OAuth
token. For more information, see
[the Google Cloud Authentication Overview](https://cloud.google.com/docs/authentication/).

API keys can be obtained from the
[Google Cloud Console > Credentials](http://console.cloud.google.com/apis/credentials)
page. OAuth tokens can be obtained by [OAuth 2](https://oauth.net/2/) clients
and libraries. For a sample command-line client, see the
[oauth2l](https://github.com/google/oauth2l) on GitHub.

## gRPC Fallback (Experimental)

Along with gRPC, most Google APIs support a simple fallback protocol that uses
Protocol Buffers (protobuf) over HTTP. It allows clients to call Google APIs
directly, often using standard library functions.

This protocol uses fixed URLs to specify the RPC endpoints, and passes
request/response messages as HTTP request/response body using HTTP POST. It
uses normal HTTP headers to pass the RPC metadata, such as System Parameters.

### URL

RPC URLs have the following format:

```
URL ::= BaseUrl "/" Service "/" Method
```

- **BaseUrl.** This is the base URL published by service owners, either via
  documentation or service discovery. For most Google APIs, the BaseUrl looks
  like `https://language.googleapis.com/$rpc` (experimental: this format may
  change in the future). The base address can be found in the API reference
  documentation where it is identified as the `Service name`. For this example,
  `language.googleapis.com` is found in the Google Cloud Natural Language API
  Reference.

- **Service.** This is the fully qualified protobuf `service` name, such as
  `google.cloud.language.v1.LanguageService`. In this case,
  `google.cloud.language.v1` is the package name in
  `google/cloud/language/v1/language_service.proto` and `LanguageService` is
  the name of the service section found in this file.

- **Method.** This is the protobuf `rpc` name, such as `AnnotateText`.

### Requests

RPC request messages are serialized and sent as the HTTP request body. For the
server to handle the request properly, the client must set several HTTP request
headers:

- **Content-Type.** The request message format is specified by the Content-Type
  header and must be `application/x-protobuf`.

- **X-Goog-Api-Key.** This specifies a valid Google API key. It is optional if
  the Authorization header is used.

- **Authorization.** This specifies a valid Google OAuth access token in the
  format of `Bearer {token}`. It is optional if an API key is provided.

### Responses

For successful requests, the HTTP status code is `200` and the HTTP response
body contains the serialized RPC response message. For unsuccessful requests,
the HTTP status code is the HTTP mapping for
[`google.rpc.Code`](https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto)
and the HTTP response body contains a serialized
[`google.rpc.Status`](https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto)
message. For details, see [Errors](https://cloud.google.com/apis/design/errors)
in the [API Design Guide](https://cloud.google.com/apis/design).

The HTTP response contains at least the following headers:

- **Content-Type.** This specifies the response serialization format. For
  normal responses and server errors, this will be `application/x-protobuf`.
  Different values can be returned for network errors, such as when a message
  is rejected by a network proxy. All such errors will be accompanied by
  appropriate HTTP status codes.

## [Examples](https://github.com/googleapis/googleapis.github.io/tree/master/examples/rpc/)

To illustrate how easily the gRPC fallback protocol can be used to call Google
RPC APIs, we've written a few examples. Each is as basic as possible - using
standard library functions wherever possible and commonly-used Protocol Buffer
support code. If you write one in a different language, send us a pull request!

- [Go](https://github.com/googleapis/googleapis.github.io/tree/master/examples/rpc/go)

- [Rust](https://github.com/googleapis/googleapis.github.io/tree/master/examples/rpc/rust)

- [Swift](https://github.com/googleapis/googleapis.github.io/tree/master/examples/rpc/swift)
