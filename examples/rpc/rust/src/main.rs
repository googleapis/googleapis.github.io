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

#[macro_use]
extern crate hyper;
extern crate reqwest;
extern crate protobuf;

use std::env;
use std::str::FromStr;
use reqwest::header::ContentType;
use reqwest::mime::Mime;
use protobuf::parse_from_bytes;
use protobuf::Message;

mod language_service;

header! { (XGoogApiKey, "X-Goog-Api-Key") => [String] }

fn main() {
    let google_api_key = env::var("GOOGLE_API_KEY").unwrap();

    let mut document = language_service::Document::new();
    document.set_content(String::from("The rain in Spain stays mainly in the plain."));
    document.field_type = language_service::Document_Type::PLAIN_TEXT;
	
    let mut analyze_entities_request = language_service::AnalyzeEntitiesRequest::new();
    analyze_entities_request.set_document(document);
    analyze_entities_request.encoding_type = language_service::EncodingType::UTF8;
    
	let serialized_bytes = analyze_entities_request.write_to_bytes().unwrap();

    let client = reqwest::Client::new();
    let mut res = client.post("https://language.googleapis.com/$rpc/google.cloud.language.v1.LanguageService/AnalyzeEntities")
		.header(ContentType(Mime::from_str("application/x-protobuf").unwrap()))
		.header(XGoogApiKey(google_api_key.to_owned()))
		.body(serialized_bytes)
		.send().unwrap();

    println!("Status: {}", res.status());
    println!("Headers:\n{}", res.headers());

    let mut buf: Vec<u8> = vec![];
    res.copy_to(&mut buf).unwrap();
    let entities = parse_from_bytes::<language_service::AnalyzeEntitiesResponse>(&buf).unwrap();
    println!("RESULTS\n{:?}", &entities);
}
