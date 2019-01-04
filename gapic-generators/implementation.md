# Implementing [GAPIC Generators](/gapic-generators)

# Background

Your mission, should you choose to accept it, is to implement a code generator
for proto3-based Google API clients.

The purpose of this document is to teach you what you need to know in order to
do this successfully; it will cover both requirements (what needs to be done in
order to have a fully-featured client library generator) and guidance (how to
actually go about doing this).

## Prior Knowledge

This document assumes that you are already familiar with
[protocol buffers](https://developers.google.com/protocol-buffers/), but it does
not assume advanced knowledge. You probably should have written a proto or at
least be very familiar with reading them, but by no means are you expected to
have written a protoc plugin before.

## Companion

This is a companion document to
[gapic/configuration](https://googleapis.github.io/gapic/configuration). That
document explains how to configure an API for client library generation; this
document describes how to write a client library generator to consume a
properly-configured API.

## Terminology

Because this document describes requirements in a language-neutral way, there
will be generalistic uses of terminology which may not apply or be appropriate
in certain languages or environments (obvious example: the use of the term
**class** even though languages such as Go do not have classes).

The requirements discussed in this document should be understood to be
principles; precise adherence to the exact vocabulary used in this document is
not an expectation.

# Interface

It is desirable for code generators to hold to a consistent interface on the
command line, in order to simplify the writing of rules and use of code
generators in tandem.

## Protocol Buffer Plugins

The protocol buffer compiler provides a
[plugin system](https://developers.google.com/protocol-buffers/docs/reference/other),
which allows plugins to be written in any language. The contract is as follows:

- The plugin should be an executable in \$PATH, and named protoc-gen-{thing}.
  This corresponds to the \--{thing}\_out option sent to the protoc executable.
  Alternatively, plugins can be explicitly specified using \--plugin.

  - For a plugin creating clients for a specific language, the option **should**
    follow the naming convention: \--{language}\_gapic_out. (This means that the
    corresponding plugin would be named protoc-gen-{language}\_gapic.)

- The plugin accepts a serialized CodeGeneratorRequest object (defined in
  [plugin.proto](https://github.com/google/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto))
  on stdin; the bulk of this is a series of FileDescriptorProto messages
  (defined in
  [descriptor.proto](https://github.com/google/protobuf/blob/master/src/google/protobuf/descriptor.proto#L61)).

- The plugin must emit a serialized CodeGeneratorResponse object (defined in
  [plugin.proto](https://github.com/google/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto))
  on stdout.

Code generators **should** be able to run without options if at all possible, as
the plugin system\'s option specification system is clunky. If options are
required, protoc allows them to be passed as \--{thing}\_opt, and whatever
string is provided here becomes set as the parameter string on the
CodeGeneratorRequest. To avoid confusion, code generators **should not** rely on
environment variables for configuration.

One very common issue that traps plugin developers is that the plugin contract
uses stdout; when protoc calls out to a plugin, it expects to consume its stdout
stream. You do not actually see the plugin\'s output, and sending anything other
than the serialized proto will result in a deserialization error. This means
**you can not use stdout for debugging**; use stderr.

# Packaging

Many languages and environments require writing files which are aware of their
expected package or location. For example, Java files have **package**
directives, and Python files have **import** statements which must match the
directory structure.

Code generators targeting environments which need this information **should**
derive the information from **one of** three sources: the google.api.metadata
file annotations, language-specific packaging annotations found in
[descriptor.proto](https://github.com/google/protobuf/blob/master/src/google/protobuf/descriptor.proto#L318),
and the proto **package** statements, in that order.

It is expected that only one of these sources of truth is consulted. If any is
set, it is expected to be set completely, and subsequent items on the above list
are ignored.

Most client libraries will require a **namespace**, a **name**, and a
**version**.

---

**Note:** In this context, we are discussing the version _of the API_, not
necessarily the version of the resulting client library on a package manager.

---

Each individual source of truth is expected to provide consistent information:
If google.api.metadata annotations are provided in more than one file, they are
expected to exactly match. The same holds for language-specific annotations and
inferences from proto **package** statements. Code generators **should** fail
with an error if any discrete source of truth is internally inconsistent. (Note
that **package** statements are able to differ if only the subpackage \-- what
comes after the version \-- is variable.)

### Vocabulary

The terms in bold above are determined as follows:

- The **namespace** is the first match among:

  - The package_namespace key in the google.api.metadata annotation, with each
    component converted from the vernacular to the language-appropriate case,
    and separated with the appropriate separator for the language.

  - All segments of the proto **package** directive before the **package name**
    (see below), separated with the appropriate separator for the language. If
    the target language uses capital letters for this purpose, the first letter
    of each segment should be capitalized.

- The **package name** is inferred by the first match among:

  - The package_name key in the google.api.metadata annotation, converted from
    the vernacular to the language-appropriate case.

  - The product_name key in the google.api.metadata annotation, converted from
    the vernacular to the language-appropriate case.

  - The final segment of the proto **package** directive immediately before the
    version (or the final segment if there is no version). If the target
    language uses capital letters, the first letter should be capitalized.

- The **version** is always inferred from the proto **package** directive; it is
  the first segment of the dot-separated package to match
  \^v\[0-9\]+(p\[0-9\]+)?((alpha\|beta)\[0-9\]+)?\$ (see
  [AIP-201](https://goto.google.com/aip/0201#valid-versions)).

  - If the package does not have a segment matching this, the version is
    considered to be empty.

  - If appropriate in the target environment, the v, p, or first letter of the
    release level **may** be capitalized.

### Vernacular to Language-Appropriate Case

The package name and namespaces in the google.api.metadata annotation are
specified in case appropriate for English prose, and are converted to the
appropriate case for the target language. To do this:

- Remove all characters not matching \[A-Za-z0-9 \] (note the space!). For
  example, \"Pub/Sub\" becomes \"PubSub\" in this step, but \"Video
  Intelligence\" is not modified.

- Replace spaces with an appropriate word separator (such as - or \_), or else
  remove them.

- Alter the case of the string if necessary (e.g. .lower()).

For example, \"Video Intelligence\" might be replaced with \"VideoIntelligence\"
or \"video-intelligence\" depending on the environment. Casing and space are
distinct here; \"Video Intelligence\" and \"BigQuery\" may (or may not) be
translated differently.

# Expected Behavior

The following section outlines the expected behavioral attributes of the
**output of** the client library generator (in other words: the libraries that
the generators write). Client libraries **must** implement these concepts in
order to be considered complete.

## Services and Methods

Each of the **service** and **rpc** directives in the requested protos **must**
be represented in the target language, unless the language or transport is
unable to support it. While how to do this appropriately may vary from language
to language, in most classical languages this is probably a class for each
service, containing methods for each rpc.

### Services

The classes for service directives **must** know the hostname (web address) for
the service, and **should** provide a mechanism to override it. This is
annotated on the service as google.api.default_host.

They **must** also know the OAuth scopes required to connect to the service if
they support connecting using service credentials. This is annotated on the
service as google.api.oauth. This is a struct with a key, canonical_scopes,
which is a string (not an array; if multiple scopes are needed, they are comma
separated).

Finally, service classes **must** also accept credentials, which are used
appropriately when requests are made. Accepting a custom gRPC channel satisfies
this requirement. Additionally, generated clients **may** accept credentials at
request time for individual requests.

## Long-Running Operations

An RPC is considered to be a \"long-running\" RPC if (and only if) the RPC\'s
return type is google.longrunning.Operation. Any API which has one or more RPCs
returning an Operation is expected to implement the Operations service (see
[operations.proto](https://github.com/googleapis/api-common-protos/blob/master/google/longrunning/operations.proto#L41))
in that API\'s subdomain.

Because the response and metadata fields in Operation are of the type
google.protobuf.Any, it is necessary to know what message to use to deserialize
them. This is annotated on the RPC as google.longrunning.operation*types. Note
that the values in this struct are \_strings*, not message objects; the code
generator must use the string to get the actual message. If the string does not
contain a period (.) character, it is considered to be a message type within the
same package.

Code generators **should** fail with an error if a type is provided in the
operation*types annotation which was not imported, or if no response type or
metadata type is provided. Code generators **should** fail with an error if
\_either* the response_type or metadata_type keys are omitted.

Client libraries **must** honor the LRO interface; if an RPC has a
google.longrunning.Operation as its return type, the generated method should
intercept it and return an appropriate idiomatic object for resolving the LRO
(such as a Future or Promise bound to the underlying Operation object).

## Streaming

Client libraries **must** implement streaming to the extent that their supported
transports allow. An RPC is streaming if the **stream** keyword is present on
the argument or response type. This is present in the MethodDescriptorProto
message
([here](https://github.com/google/protobuf/blob/master/src/google/protobuf/descriptor.proto#L268))
using the client_streaming and server_streaming keys.

# Recommended Behavior

## Retries

Client libraries **should** automatically retry when they receive an error and
can be reasonably certain that it is safe to do so:

- Retry UNAVAILABLE on all methods.

- Any RPC with a google.api.http annotation with a non-empty get key (ignore
  additional_bindings for this purpose) is assumed to be idempotent and should
  additionally retry ABORTED, INTERNAL and UNKNOWN errors. The client library
  may choose its backoff algorithm and a reasonable limit for number of retries.

If implementing a transport other than gRPC, client libraries **should**
approximate the behavior described above. For plain HTTP transports, consult the
[gRPC error code table](https://cloud.google.com/apis/design/errors#handling_errors)
for a mapping to HTTP error codes.

## Routing Headers

In order for gRPC API backends to route traffic efficiently, it is necessary for
some values to be sent in HTTP headers as well as in the request payload.

Code generators **should** look at URL-based variables declared in the
google.api.http annotation and transcribe these into the x-goog-request-params
header in unary calls. A URL-based variable is a variable declared as a key in
curly braces in the URI string. For example:

```
rpc CreateTopic(CreateTopicRequest) {
 option (google.api.http).post = \"{parent=projects/\*}/topics\";

 }
```

In this case, the applicable variable is parent, and it refers to the parent
field in CreateTopicRequest. When the user provides an instance of
CreateTopicRequest to the method (or once the client library has built it, in
the case of flattened fields), the client library should then extract the key
and value, URL-encode them, and append them to the x-goog-request-params header.
(Much like URL parameters, if there is more than one key-value pair, the &
character is used as the separator.)

Note that there is no particular annotation used for this; the presence of the
key in any of the standard fields (get, post, put, patch, delete) on the
google.api.http annotation is sufficient.

# Optional Behavior

Optional behavior means that client library generators **may** choose to
implement these features; it is possible to declare them complete whether they
do so or not. If the features are added later, they **must** be added in a
backwards-compatible way.

## Packaging

Code generators **may** output package metadata files sufficient for the output
library to be used in place. They are _not_ required to generate libraries which
can be publishable in place; it is expected that follow-up processes may replace
or augment package data.

Client library generators determine an appropriate name for the library based on
the following rules:

- If protocol buffers includes a language-specific annotation for specifying the
  package (such as java_package or csharp_namespace) and it is specified, then
  it is used.

- Use the **package namespace**, **package name**, and possibly \*\*API
  version** (see the \"packaging\" section above for definitions) concatenated
  together using the appropriate separator for the language. Library names
  **should** end with the **API version\*\* **unless** that language has a
  strategy for packaging multiple API versions together in a single package.

## Automatic Pagination

Many API responses, particularly to list and search methods, are paged. Client
libraries **may** provide automatic resolution of pagination (meaning that it
performs requests in the background on an as-needed basis).

Pagination can be inferred when the input message for an RPC contains an int32
page_size field **and** a string page_token field, **and** the response field
contains one **repeated** non-primitive field and a string next_page_token
field. In this case, the next_page_token value from the response is used to
populate the page_token value in a subsequent request; when the next_page_token
value is unset, the client knows it has reached the end.

Client libraries that are implementing automatic pagination **must** still
provide access to the individual fields on the response message, in the usual
fashion.

If the response message has more than one non-primitive **repeated** field, the
first one (in order of appearance in the file **and** field number) is used. If
the first field by order of appearance in the message and the first field by
field number do not match, code generators that implement automatic pagination
**should** fail with an error.

Client libraries that are implementing automatic resolution of pagination
**should** only perform requests for future pages on an as-needed basis, and
avoid greedily resolving potentially long and unnecessary result sets.

## Flattening

Many RPCs provide information about which pieces of the request are important
and commonly used.

In many languages, functions and methods take multiple positional or keyword
arguments.

Some APIs provide annotations to hint how to effectively translate from a single
request object to individual arguments, and client libraries **may** provide
overloads based on these hints; however, client libraries implementing this
feature **must** retain the default behavior of sending the full request object.
(Put another way, if an API _adds_ this annotation to an already-published API,
the resulting library change **must** be non-breaking.)

Client libraries **may** also choose to provide this functionality in some cases
but not others, as appropriate in the environment. For example, it is
permissible to provide an overload only if all arguments are primitives, or only
if all arguments are required. The requirement that the request object is always
accepted still applies.

### Method Signatures

An RPC making use of this feature will provide a google.api.method_signature
annotation. The presence of this annotation means that an overload with a
flattened method signature is desired where supported. The field named fields
lists the names of the expected fields, in order, as strings. If a field\'s name
contains a period (.) character, this indicates a nested field.

### Required Arguments

An RPC may indicate that certain arguments are always expected. While client
libraries generally **should not** perform validation on this (that is the
server\'s role), client libraries **may** distinguish required arguments in
method signatures from optional ones if appropriate for the language. A field is
considered required for this purpose if annotated with the google.api.required
annotation (note that this is an annotation on the field, not the RPC).

### Errors

If an RPC lists a nested field in (google.api.method_signature).fields, none of
the referenced fields may be repeated except for the last one. Code generators
implementing this feature **must** error with a descriptive error message if
encountering a non-terminal repeated field as a field name.

If any fields are required arguments, all required arguments are expected to
appear before any optional ones. Code generators implementing this feature
**should** error with a descriptive error message if encountering a required
field after an optional one, and **must** do so if the resulting client library
would not be valid.

## Resource Name Classes

APIs often use canonical names for resources following the
[resource names](https://cloud.google.com/apis/design/resource_names) pattern:
the canonical name for a Topic resource in Pub/Sub is
projects/{project}/topics/{topic}, and the canonical name for a Subscription is
projects/{project}/subscriptions/{subscription}. APIs accept these resource
names as parameters when retrieving and modifying resources, and when
referencing them in other objects.

Client libraries **may** provide helper classes or functions to make
constructing these objects more straightforward. However, client libraries that
choose to implement this feature **must** accept the plain strings also. (An
existing API that adds the annotations should be able to do so without incurring
a breaking change.)

A particular message may represent a resource (for example, Topic and
Subscription in the discussion above), but a particular field (usually string
name) identifies the resource\'s name. The google.api.resource annotation
identifies such a field as declaring a particular resource class, and client
libraries implementing this feature **should** create a corresponding class and
accept it in place of this field. The path field identifies the resource path
(like the strings above); the \* character is used for the segments which must
be individually identified. The base_name field indicates the name of the
resource, which should be used to algorithmically determine how to name the
resource name class. If base_name is omitted, use the name of the message
itself.

### Resource Sets

Occasionally, a single field will denote one of a set of resources. In this
situation, the google.api.resource_set annotation will be used instead, and the
resources key will contain the list. In this situation, the base_name field on
each individual list is required (code generators **should** fail with an error
if one is not provided). The top-level annotation also has a base_name key,
which is optional, and is the name of the message otherwise.

### Referring to Another Resource

A message may also have a field which refers to another resource. In this case,
the applicable field will carry the google.api.resource_type annotation, which
is a string referring to a message which will be annotated as described above.
Code generators **should** fail with an error if they are unable to resolve a
google.api.resource_type annotation, either because it is not a valid message or
because that message does not have a field annotated as described above.

# Documentation

Code generators are not expected to produce complete narrative documentation.
However, code generators **should** preserve the comments in the proto files,
attaching them to the appropriate artifacts in the output code.

Code generators **should** assume that the comments provided to it are in
Markdown ([CommonMark](http://commonmark.org/)) format, and **should** convert
them into an appropriate format for the ecosystem if necessary (there should be
off-the-shelf tools available for this purpose; avoid rolling one\'s own
documentation conversion unless necessary).

# Testing

### Unit Testing

Client libraries **should** be generated with language-appropriate unit tests,
using appropriate tooling for the target environment. This should be output in
such a way that a developer familiar with the ecosystem could quickly run them.

# Future Expectations

While we intend to adhere to the principle that a code generator written against
this guidance will remain reasonably complete, new guidance (particularly for
optional behavior) may be added to this document in the future.

The following is in-progress work that is expected to be added here in the
future:

- End-to-end testing: [Showcase](https://goto.google.com/actools-gapic-showcase)
  will provide a mechanism for a client library to test itself for both
  correctness and completion. When this is available, it will be advised that
  code generators implement the necessary work to test against it.

- Sample generation: Once the input around sample generation is sufficiently
  stable, it will be advised that code generators implement runnable samples for
  generated APIs.

# Appendices

## Appendix A: Stand-Alone Interface

In the interest of stand-alone execution, ease of integration within other
environments, and testability, it is also useful to execute code generators as
stand-alone programs.

To accommodate this, code generators **may** accept the following options:

- \--descriptor - The path on disk to a file containing a serialized
  FileDescriptorSet; this is the output of protoc \--include_imports
  \--include_source_info \--descriptor_set_out. If this is set, the descriptor
  is read **instead of** a CodeGeneratorRequest object on stdin. (Note that
  these messages are similar but not identical, and they are not
  wire-compatible.)

- \--package - The proto package designated the files actually intended for
  output. When providing a descriptor directly with \--descriptor, the
  information regarding which .proto files are being specifically requested for
  generation (as opposed to their imports) is lost. Specifying this indicates
  that all .proto files belonging to that package or any subpackage be included.

- \--output - The output directory. The generator **should** error if the
  directory does not exist.

Code generators **may** accept other options which somehow affect the result. If
they do so, it is recommended that these have an inferrible default, and be
reasonably targeted to the focus of that particular generator (for example,
something specific to the language).

If a code generator is written to support output in multiple languages, it
**should** provide a \--language argument in the stand-alone interface to
distinguish them.

If a code generator is written to support multiple choices of templates, it
**should** provide a \--template argument in the stand-alone interface.

## Appendix B: Where are the protos I need?

Two places:

- The annotated common protos (e.g. google.api.\*) are in the
  [api-common-protos](https://github.com/googleapis/api-common-protos) repo, on
  the input-contract branch.

- Annotated versions of Vision, Speech, and Pub/Sub are in the
  [googleapis](https://github.com/googleapis/googleapis) repo, on the
  input-contract branch.

This means you need to check out both repos and put them both on that branch in
order to work.

### How do I invoke this properly?

For the protoc interface, you probably want something like...

```
$ protoc \
  --proto_path path/to/api-common-protos \
  --proto_path path/to/googleapis \
  --yourplugin_out path/to/output \
  path/to/googleapis/google/pubsub/v1/*.proto
```

If you are in the googleapis directory, you still need \--proto_path=. as the
second argument (but the path to the protos becomes shorter).

Order matters. The api-common-protos path must precede the googleapis path.
