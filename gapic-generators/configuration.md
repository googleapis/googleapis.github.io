# Configuring [GAPIC Generators](/gapic-generators)

To support generation of easy-to-use API clients, GAPIC generators accept
additional configuration that supplements Protocol Buffer descriptions of APIs.
Configuration that is common across languages is represented with
[custom options](https://developers.google.com/protocol-buffers/docs/proto#customoptions)
that are added as annotations to Protocol Buffer source files. These annotations
are described here.

## API Metadata

The API name and namespace are provided to ensure that your client library's
presentation is consistent in packaging, code, documentation, and so on. The
package details are usually inferred from the proto package; this is provided
where they do not match.

### Annotation

| Name                                       | Type              | Example                                           |
| ------------------------------------------ | ----------------- | ------------------------------------------------- |
| google.api.metadata                        | _file annotation_ |                                                   |
| &nbsp;&nbsp;&nbsp;&nbsp; product_name      | string            | "BigQuery" _or_ "Kubernetes Engine"               |
| &nbsp;&nbsp;&nbsp;&nbsp; product_uri       | string            | "https://cloud.google.com/kubernetes-engine"      |
| &nbsp;&nbsp;&nbsp;&nbsp; package_namespace | string[]          | ["Google", "Cloud"]                               |
| &nbsp;&nbsp;&nbsp;&nbsp; package_name      | string            | "BigQuery" or "Container" or "Video Intelligence" |

### Example

```protobuf
package google.pubsub.v1;

option (google.api.metadata) = {
    product_name: "Pub/Sub"
    product_uri: "https://cloud.google.com/pubsub"
    package_namespace: ["Google", "Cloud"]
};
```

## Service Information

In order to make requests to your API, the client library needs to know where it
normally is hosted. Also, many APIs use OAuth, and the client needs to know what
scopes it needs.

### Annotations

| Name                            | Type     | Example                                          |
| ------------------------------- | -------- | ------------------------------------------------ |
| google.api.default_host         | string   | "bigquery.googleapis.com"                        |
| google.api.oauth                |          |                                                  |
| &nbsp;&nbsp;&nbsp;&nbsp; scopes | string[] | ["https://cloud.google.com/auth/cloud-platform"] |

### Example

```protobuf
service LibraryService {
    // The address where this API is typically served.
    option (google.api.default_host) = "library.googleapis.com";
    // The OAuth scopes needed to make requests to this API.
    option (google.api.oauth) = {
        scopes: ["https://cloud.google.com/auth/cloud-platform",\
            "https://cloud.google.com/auth/library"]
    };
    rpc GetBook(GetBookRequest) returns (GetBookResponse) { \... };
    ...
}
```

## Long-Running Operations

Long-running operations provide a
[common design pattern](https://cloud.google.com/apis/design/design_patterns#long_running_operations)
for handling cases where an API method takes a long time to complete. Client
libraries provide a friendly interface to these (generally implementing
something like a Future pattern, but it varies by environment).

When using an LRO, the return type of the RPC becomes a
google.longrunning.Operation; in order to provide a user with the final result,
however, the client must know what type the final result will be.

### Annotations

| Name                                   | Type             | Example                                      |
| -------------------------------------- | ---------------- | -------------------------------------------- |
| google.api.operation                   | _rpc annotation_ |                                              |
| &nbsp;&nbsp;&nbsp;&nbsp; response_type | string           | "g.c.speech.v1.LongrunningRecognizeResponse" |
| &nbsp;&nbsp;&nbsp;&nbsp; metadata_type | string           | "g.c.speech.v1.LongrunningRecognizeMetadata" |

### Example

```protobuf
service Speech {
    rpc LongRunningRecognize(LongRunningRecognizeRequest)\
        returns (google.longrunning.Operation) {
        // Once the operation is complete, the ultimate result
        // will be a LongRunningRecognizeResponse.
        option (google.api.operation) = {
            response_type: "google.cloud.speech.v1.LongRunningRecognizeResponse"
            metadata_type: "google.cloud.speech.v1.LongRunningRecognizeMetadata"
        };
    }
}
```

_Everything after this point can be safely added in a non-breaking way after an
API is published._

## Resource Name Classes

Certain languages provide convenient classes to represent resource names, which
are a common parameter in
[resource-oriented design](https://cloud.google.com/apis/design/resources). When
annotating a message that represents a resource, this is identified and the
format of the resource name declared. This allows client libraries in static
languages to produce helpful wrapper classes around the resource string.

### Annotations

| Name                                                   | Type       | Example                                   |
| ------------------------------------------------------ | ---------- | ----------------------------------------- |
| google.api.resource                                    | Resource   |                                           |
| &nbsp;&nbsp;&nbsp;&nbsp; path                          | string     | "projects/{project_id}/topics/{topic_id}" |
| &nbsp;&nbsp;&nbsp;&nbsp; name                          | string     | "Topic"                                   |
| google.api.resource_set                                |
| &nbsp;&nbsp;&nbsp;&nbsp; resources                     | Resource[] |
| &nbsp;&nbsp;&nbsp;&nbsp; google.api.resource_reference | string[]   | "google.pubsub.v1.Topic"                  |

### Examples

Declaring a resource:

```protobuf
// A topic resource.
message Topic {
    // Name of the topic.
    // Format is `projects/{project}/topics/{topic}`.
    string name = 1
    [(google.api.resource).path = "projects/{project_id}/topics/{topic_id}"];
    // <redacted for brevity>
}
```

A separate annotation is used to identify a reference to that resource:

```
message Subscription {
    // Name of the subscription.
    // Format is `projects/{project}/subscriptions/{sub}`.
    string name = 1
        [(google.api.resource).path = "projects/{project_id}/subscriptions/{subscription_id}"];
        // The name of the topic from which this subscription is receiving messages.
        // Format is `projects/{project}/topics/{topic}`.
        // The value of this field will be `_deleted-topic_` if the topic has been
        // deleted.
        string topic = 2 [(google.api.resource_reference) = "google.pubsub.v1.Topic"];
        // <redacted for brevity>
}
```

Sometimes there are multiple selectors, such as if a resource is able to be
owned by different types of parents (for example, either a project or an
organization).

```protobuf
message LogEntry {
    // Required. The resource name of the log to which this log entry belongs:
    //     "projects/[PROJECT_ID]/logs/[LOG_ID]"
    //     "organizations/[ORGANIZATION_ID]/logs/[LOG_ID]"
    //     "billingAccounts/[BILLING_ACCOUNT_ID]/logs/[LOG_ID]"
    //     "folders/[FOLDER_ID]/logs/[LOG_ID]"
    string log_name = 12 [
        (google.api.resource_set) = {
            base_name: "Log"
            resources: [
                {base_name: "ProjectLog" path:"projects/{project_id}/logs/{log_id}"},
                {base_name: "OrganizationLog" path:"organizations/{org_id}/logs/{log_id}"},
                {base_name: "FolderLog" path:"folders/{folder_id}/logs/{log_id}"},
                {base_name: "BillingLog" path:"billingAccounts/{billing_account_id}/logs/{log_id}"}
            ]
        }];
}
```

## RPC Method Arguments

In both RPC and REST APIs, requests and responses are represented using an input
structure describing an API request and an output structure describing the API
response. Providing discrete arguments can yield a better client library
experience in some cases.

### Annotations

| Name                            | Type             | Example                          |
| ------------------------------- | ---------------- | -------------------------------- |
| google.api.method_signature     | _rpc annotation_ |                                  |
| &nbsp;&nbsp;&nbsp;&nbsp; fields | string[]         | ["topic", "subscription"]        |
| google.api.field_behavior       | _(field)_        | enum REQUIRED, OUTPUT_ONLY, etc. |

### Examples

For example, consider some methods of the Pub/Sub API:

```protobuf
rpc Publish(PublishRequest) returns (PublishResponse) {
    // Expose `topic` and `messages` as separate arguments
    // in most client libraries.
    option (google.api.method_signature) = {
        fields: ["topic", "messages"]
    };
}
```

Many languages provide a mechanism for argument defaults. Protocol buffers does
not have an official concept of required fields, but they can be specified as
annotations so that target environments will use required or optional arguments
in the method signature as appropriate:

```protobuf
rpc Pull(PullRequest) returns (PullResponse) {
    // Expose `subscription` and `max_messages` as top-level arguments;
    // the latter has a default of 0.
    option (google.api.method_signature) = {
        fields: ["subscription", "max_messages"]
        additional_signatures: {
            fields: ["subscription", "return_immediately", "max_messages"]
        }
    };
}

message PullRequest {
    // Required. The subscription being pulled.
    string subscription = 1 [(google.api.field_behavior) = REQUIRED];
    // The maximum number of messages to pull. The backend may return
    // fewer than this number.
    int32 max_messages = 2;
}
```
