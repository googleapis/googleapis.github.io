# How to Call Google APIs: RPC Edition

_For many developers, the easiest way to call a Google API is with one of our client libraries. But occasionally one may prefer to make API calls directly - perhaps from a language or environment that we don’t support or using a different networking library or tool. Here we’ll show you how to do it._

This page focuses on calling Google APIs directly using their underlying RPC implementation. Most of these APIs are also available as REST services. For that, see [How to Call Google APIs, REST Edition](/HowToREST).


## What you’ll need

### An API definition
Most Google APIs are designed as RPC APIs using the Protocol Buffers language. The Protocol Buffers definition of public Google APIs are hosted on GitHub in the googleapis repository.

For these examples, we’ll use the Cloud Natural Language API, which is defined by google/cloud/language/v1/language_service.proto. The RPC details are documented online in the Google Cloud Natural Language API reference. We’ll call the AnalyzeEntities API, which takes a block of text as input and returns a list of names and nouns that it finds in the text along with some interesting properties of each entity.
Protocol Buffers support 
For all Google RPC APIs, the messages that are sent and received using an encoding called  Protocol Buffers, and the definitive descriptions of these APIs are written in the Protocol Buffer Language. 

To compile Protocol Buffer Language files, you’ll need `protoc`, the Protocol Buffer compiler. You can download `protoc` from the google/protobuf release page on GitHub or build it from source. You’ll probably also need a code generation plugin for the language that you’re using. Plugins are standalone executables written in many different languages, and the plugin interface is defined in the plugin.proto file. Here are some plugins that we have used:
https://github.com/golang/protobuf
https://github.com/apple/swift-protobuf
### Making API requests
gRPC is the recommended way to call Google RPC APIs. gRPC support is typically provided by additional `protoc` plugins that generate code for API clients and servers. This code uses lower-level primitives that send messages using gRPC’s HTTP/2-based messaging system, which supports request multiplexing, streaming APIs, and advanced flow control. To learn more about working with gRPC, visit grpc.io/docs. See also: grpcurl.

If gRPC support is unavailable, Google APIs can also be called using HTTP/1. All requests should be made as HTTP/1 POSTs using the protocol described below.
### Authentication
To use Google APIs, a client needs to use API keys for unauthenticated requests or OAuth tokens for authenticated request. For more information, see Authentication Overview.

The API keys can be obtained from the Google Cloud Console > Credentials page. The OAuth tokens can be obtained using an OAuth library. For more information, see the documentation for the oauth2l on GitHub.
## How it works
### The HTTP RPC Protocol
Most Google APIs support a simple RPC protocol using Protocol Buffers (protobuf) over HTTP. It allows clients to call Google APIs directly, often using standard library functions.

This protocol uses fixed URLs to specify the RPC endpoints, and passes request/response messages as HTTP request/response body using HTTP POST. It uses normal HTTP headers to pass the RPC metadata, such as System Parameters.
URL
RPC URLs have the following format:

URL ::= BaseUrl "/" Service "/" Method

BaseUrl. This is the base URL published by service owners, either via documentation or service discovery. For most Google APIs, the BaseUrl looks like "https://language.googleapis.com/$rpc". The base address can be found in the API reference documentation where it is identified as the “Service name”. For this example, “language.googleapis.com” is found in the Google Cloud Natural Language API Reference. 
Service. This is the fully qualified protobuf `service` name, such as "google.cloud.language.v1.LanguageService". In this case, “google.cloud.language.v1” is the package name in google/cloud/language/v1/language_service.proto and “LanguageService” is the name of the service section found on this line.
Method. This is the protobuf `rpc` name, such as "AnnotateText".
Requests
RPC request messages are serialized and sent as the HTTP request body. For the server to handle the request properly, the client must set several HTTP request headers:

Content-Type. The request message format is specified by the Content-Type header and must be "application/x-protobuf".
X-Goog-Api-Key. This specifies a valid Google API key. It is optional if the Authorization header is used.
Authorization. This specifies a valid Google OAuth access token in the format of "Bearer {token}". It is optional if the request is unauthenticated or if an API key is used.
User-Agent. This should contain a meaningful string that identifies the client application for analytics and troubleshooting purposes. It is usually provided automatically by HTTP support libraries.
Responses
For successful requests, the HTTP status code is `200` and the HTTP response body contains the serialized RPC response message. For unsuccessful requests, the HTTP status code is the HTTP mapping for `google.rpc.Code` and the HTTP response body contains a serialized `google.rpc.Status` message. 

The HTTP response contains at least the following headers:

Content-Type. This specifies the response serialization format. For normal responses and server errors, this will be "application/x-protobuf". Different values can be returned for network errors, such as when a message is rejected by a network proxy. All such errors will be accompanied by appropriate HTTP status codes.
