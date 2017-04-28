/**
* request_page.go
*
* A class for the functionality of the request page.
*
* Author: Tony Wang
*
* Date Modified: 8 Feb 2017
*/
package app

import(
	"net/http"
	"encoding/json"
    "github.com/exogig/gig"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)

func RequestPageHandler(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent",GetPassword())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("exogig").C("gigs")

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	var updatedRequestList []gig.Request
	err = decoder.Decode(&updatedRequestList)

	// Format the response to the POST
	resultJson, _ := json.Marshal(updatedRequestList)

	if (len(updatedRequestList) > 0) {
		gigQuery := bson.M{"gigid": updatedRequestList[0].GigId}
		requestUpdate := bson.M{"$set": bson.M{"gigrequestlist": updatedRequestList}}
		err = collection.Update(gigQuery, requestUpdate)
		check_error(err)
	}
	// Write the response to the client
	w.Write(resultJson)
	log.Println("[DEBUG]", updatedRequestList)
}
