#!/bin/sh
# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

curl "https://language.googleapis.com/v1/documents:analyzeEntities" \
 -X POST \
 -H "X-Goog-Api-Key: ${GOOGLE_API_KEY}" \
 -H "Content-Type: application/json" \
 -d '{"document":{"content":"The rain in Spain stays mainly in the plain.", "type":"PLAIN_TEXT"}}' \
 -i
