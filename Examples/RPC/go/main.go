package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/golang/protobuf/proto"
	"google.golang.org/genproto/googleapis/cloud/language/v1"
	"google.golang.org/genproto/googleapis/rpc/status"
)

func main() {
	request := &language.AnalyzeEntitiesRequest{
		Document: &language.Document{
			Type: language.Document_PLAIN_TEXT,
			Source: &language.Document_Content{
				Content: "The rain in Spain stays mainly in the plain.",
			},
		},
	}
	data, err := proto.Marshal(request)
	if err != nil {
		panic(err)
	}

	url := "https://language.googleapis.com/$rpc/" +
		"google.cloud.language.v1.LanguageService/AnalyzeEntities"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
	if err != nil {
		panic(err)
	}
	req.Header.Set("X-Goog-Api-Key", os.Getenv("GOOGLE_API_KEY"))
	req.Header.Set("User-Agent", "myapp/0.1")
	req.Header.Set("Content-Type", "application/x-protobuf")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	data, err = ioutil.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	response := &language.AnalyzeEntitiesResponse{}
	if res.StatusCode == 200 {
		if err := proto.Unmarshal(data, response); err != nil {
			panic(err)
		}
	} else {
		var st status.Status
		if err := proto.Unmarshal(data, &st); err != nil {
			panic(err)
		}
		log.Printf("%+v", st)
		os.Exit(-1)
	}

	log.Printf("REQUEST: %+v", request)
	log.Printf("RESPONSE: %+v", response)
}

