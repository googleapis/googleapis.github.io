# How to Call Google APIs: REST Edition

_For many developers, the easiest way to call a Google API is with one of our
client libraries. But occasionally someone may prefer to make API calls
directly - perhaps from a language or environment that we don’t support or
using a different networking library or tool. Here we’ll show you how to do
it._

This page focuses on calling Google APIs using JSON REST interfaces. Most of
these APIs are also available as Protocol Buffer-based RPC services. For more
on that, see [How to Call Google APIs, RPC Edition](/HowToRPC).

## What you’ll need

### An API definition

Most Google APIs are available as JSON REST services. These APIs are formally
described by the
[Google API Discovery Service](https://developers.google.com/discovery/) in a
JSON representation known as the
[Discovery Document](https://developers.google.com/discovery/v1/reference/apis)
format.

For an example, see the
[Cloud Natural Language API](https://cloud.google.com/natural-language/), which
is defined by
[this Discovery Document](https://language.googleapis.com/$discovery/rest?version=v1).
Human-readable documentation is in the
[Google Cloud Natural Language API reference](https://cloud.google.com/natural-language/docs/reference/rest/).
We’ll call the
[AnalyzeEntities](https://cloud.google.com/natural-language/docs/reference/rest/v1/documents/analyzeEntities)
service, which takes a block of text as input and returns a list of names and
nouns that it finds in the text along with some interesting properties of each
entity.

### JSON

Google REST APIs use JSON for most message responses and POST bodies. Quoting
[www.json.org](https://www.json.org/):

> JSON (JavaScript Object Notation) is a lightweight data-interchange format.
> It is easy for humans to read and write. It is easy for machines to parse and
> generate. It is based on a subset of the
> [JavaScript Programming Language](http://crockford.com/javascript/),
> [Standard ECMA-262 3rd Edition - December 1999](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf).
> JSON is a text format that is completely language independent but uses
> conventions that are familiar to programmers of the C-family of languages,
> including C, C++, C#, Java, JavaScript, Perl, Python, and many others. These
> properties make JSON an ideal data-interchange language.

### Making REST API Requests

Google REST APIs are designed to be called by any standards-compliant HTTP
client, including the [curl](https://curl.haxx.se/) command-line tool and
library.

### Authentication

To use Google APIs, a client needs to authenticate with an API key or an OAuth
token. For more information, see
[the Google Cloud Authentication Overview](https://cloud.google.com/docs/authentication/).

API keys can be obtained from the
[Google Cloud Console > Credentials](http://console.cloud.google.com/apis/credentials)
page. OAuth tokens can be obtained by [OAuth 2](https://oauth.net/2/) clients
and libraries. For a sample command-line client, see the
[oauth2l](https://github.com/google/oauth2l) on GitHub.

## An example

Here is a simple example that uses [curl](https://curl.haxx.se/) to call the
[AnalyzeEntities](https://cloud.google.com/natural-language/docs/reference/rest/v1/documents/analyzeEntities)
service:

```
$ curl "https://language.googleapis.com/v1/documents:analyzeEntities" \
  -X POST \
  -H "X-Goog-Api-Key: $GOOGLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"document":{"content":"The rain in Spain stays mainly in the plain.", "type":"PLAIN_TEXT"}}' \
  -i
HTTP/2 200
content-type: application/json; charset=UTF-8
[other headers]

{
  "entities": [
    {
      "name": "rain",
      "type": "OTHER",
      "metadata": {},
      "salience": 0.67902344,
      "mentions": [
        {
          "text": {
            "content": "rain",
            "beginOffset": 4
          },
          "type": "COMMON"
        }
      ]
    },
    {
      "name": "plain",
      "type": "OTHER",
      "metadata": {},
      "salience": 0.17103066,
      "mentions": [
        {
          "text": {
            "content": "plain",
            "beginOffset": 38
          },
          "type": "COMMON"
        }
      ]
    },
    {
      "name": "Spain",
      "type": "LOCATION",
      "metadata": {},
      "salience": 0.1499459,
      "mentions": [
        {
          "text": {
            "content": "Spain",
            "beginOffset": 12
          },
          "type": "PROPER"
        }
      ]
    }
  ],
  "language": "en"
}
```
