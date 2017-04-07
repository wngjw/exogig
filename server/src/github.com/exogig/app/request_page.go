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

	log.Println("[DEBUG] Requested song: ", requestedSong)
	log.Println("[DEBUG] Name of requested song: ", requestedSong.RequestedSongName)

/// Below is all old code that needs to be changed ///
  
}
