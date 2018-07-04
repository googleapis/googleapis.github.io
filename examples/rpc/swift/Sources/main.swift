// Copyright 2018 Google LLC. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Foundation
import Dispatch
import SwiftProtobuf

guard let GoogleAPIKey = ProcessInfo.processInfo.environment["GOOGLE_API_KEY"] else {
    print("Please set the GOOGLE_API_KEY environment variable.")
    exit(-1)
}

var document = Google_Cloud_Language_V1_Document()
document.type = .plainText
document.content = "The rain in Spain stays mainly in the plain."

var request = Google_Cloud_Language_V1_AnalyzeEntitiesRequest()
request.document = document
let requestData = try request.serializedData()

let path = "https://language.googleapis.com/$rpc/"
  + "google.cloud.language.v1.LanguageService/AnalyzeEntities"
let url = URL(string:path)!
var urlRequest = URLRequest(url:url)
urlRequest.httpMethod = "POST"
urlRequest.httpBody = requestData
urlRequest.addValue("application/x-protobuf", forHTTPHeaderField:"Content-Type")
urlRequest.addValue(GoogleAPIKey, forHTTPHeaderField:"X-Goog-Api-Key")

let sem = DispatchSemaphore(value: 0)
let task = URLSession.shared.dataTask(with:urlRequest) { data, response, error in
  guard let data = data, error == nil else {
    // check for fundamental networking error
    print("error=\(String(describing:error))")
    return
  }

  if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode != 200 {
    // check for http errors
    print("statusCode should be 200, but is \(httpStatus.statusCode)")
    print("response = \(String(describing:response))")
  }

  let result = try! Google_Cloud_Language_V1_AnalyzeEntitiesResponse(serializedData:data)
  print("\(result)")
  sem.signal()
}
task.resume()

_ = sem.wait()
