/*
 * Copyright 2019 Google LLC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

const auth = require('google-auth-library'); // for service account auth
const fetch = require('node-fetch');
const Language = require('../pbjs-genfiles/proto').google.cloud.language.v1;

async function main() {
  let headers = {};

  if (process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
    // service account authentication
    const serviceUri =
      'https://language.googleapis.com/google.cloud.language.v1.LanguageService';
    const googleAuth = new auth.GoogleAuth();
    const client = await googleAuth.getClient();
    headers = await client.getRequestHeaders(serviceUri);
  } else if (process.env['GOOGLE_API_KEY']) {
    // API key authentication
    headers = {'X-Goog-Api-Key': process.env['GOOGLE_API_KEY']};
  } else {
    throw new Error(
      'Please set one of environment variables: GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_API_KEY'
    );
  }

  headers['Content-Type'] = 'application/x-protobuf';
  headers['User-Agent'] = 'testapp/1.0';

  const request = Language.AnalyzeEntitiesRequest.fromObject({
    document: {
      type: 'PLAIN_TEXT',
      content: 'The rain in Spain stays mainly in the plain.',
    },
  });
  const requestBuffer = Language.AnalyzeEntitiesRequest.encode(
    request
  ).finish();

  const url =
    'https://language.googleapis.com/$rpc/google.cloud.language.v1.LanguageService/AnalyzeEntities';
  const fetchResult = await fetch(url, {
    headers,
    method: 'post',
    body: requestBuffer,
  });
  if (!fetchResult.ok) {
    throw new Error(fetchResult.statusText);
  }
  const responseArrayBuffer = await fetchResult.arrayBuffer();
  const response = Language.AnalyzeEntitiesResponse.decode(
    Buffer.from(responseArrayBuffer)
  );

  console.log(response);
}

main().catch(err => {
  console.error(err);
});
