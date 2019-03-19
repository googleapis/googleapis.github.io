# Google APIs

Google provides APIs for many of its services. APIs provide a mechanism for
users to add the power of Google's technology and tools to their own
applications.

## How to call Google APIs

The easiest way to call a Google API is with a [client library][], when one is
available for the desired API and language. For developers working on APIs or
in environments that do not yet have a client library, Google APIs can be
called using traditional HTTP/JSON calls, or using [gRPC][]:

- [Calling Google APIs with HTTP/JSON](./usage/http-json.md)
- [Calling Google APIs with gRPC](./usage/grpc.md)

Google also provides the API definition for many APIs, expressed using
[protocol buffers][]. This provides an extensible platform for building
powerful tooling in a wide variety of language, or making API definitions
available in other formats.

Learn more about [usage][].

[client library]: https://cloud.google.com/apis/docs/cloud-client-libraries
[grpc]: https://grpc.io/
[protocol buffers]: https://developers.google.com/protocol-buffers/
[usage]: /usage/

## Google API design

Google APIs strive to be simple, intuitive, and consistent. Toward that end, we
publish [API Improvement Proposals][], which seek to codify Google's API
standards, and provide a reference for both our internal engineers, and also
for those who seek to build their own APIs that use our tooling or interact
with our services.

[api improvement proposals]: /design/

## Join the conversation

If you have feedback or questions regarding API design or methodology, please
file an issue in the `googleapis.github.io` [issues area][]. Pull requests are
also welcome.

For specific tool questions, please file an issue on the corresponding
repository.

We look forward to hearing from you!

[issues area]: https://github.com/googleapis/googleapis.github.io/issues
