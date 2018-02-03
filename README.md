# Google API Design

This repository is for hosting technical articles and issues related to Google APIs.

### Introduction

[Google APIs](/googleapis/googleapis) refer to networked APIs provided by Google
services. Most Google APIs are hosted on the `googleapis.com` domain, and support
both [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) APIs
and [gRPC](https://grpc.io/) APIs via
[transcoding](https://github.com/googleapis/googleapis/blob/master/google/api/http.proto).

Google APIs are developed as Protocol Buffers (proto) based RPC services. The
API definition are specified using proto files, which are open sourced in the
[Google APIs](https://github.com/googleapis/googleapis) repository. External
developers can use the published proto files to generate documentation and
client libraries, or use them for their own API definition.

### API Design Guide

In order to provide great developer experience, Google APIs use a common
[API Design Guide](https://cloud.google.com/apis/design) across different
products. The design guide encourages simple and consistent API design
philosophy. It also provides solutions to common design issues, such as
proper default value for enums.

### Feedback and Questions

If you have any feedback or questions regarding Google API Design, please
feel free to file an issue in this repository. We will try our best to
address them. Thanks.
