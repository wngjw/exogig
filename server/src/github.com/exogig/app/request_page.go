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
	"log"
  "github.com/exogig/gig"
	"gopkg.in/mgo.v2"
)

func RequestPageHandler(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent",GetPassword())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	//collection := session.DB("exogig").C("gigs")

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	var requestedSong gig.Request
	err = decoder.Decode(&requestedSong)

	// Format the response to the POST
	resultJson, _ := json.Marshal(requestedSong)

	// Write the response to the client
	w.Write(resultJson)

	log.Println("[DEBUG] Response: ", resultJson)
	log.Println("[DEBUG] Requested song: ", requestedSong)
	log.Println("[DEBUG] Name of requested song: ", requestedSong.Name)

	//err = collection.Update(bson.M{"gigid":requestedSong.Name},bson.M{"$set": bson.M{"bio":artist.Bio,"genre":artist.Genre}})
}
