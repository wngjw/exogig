/*
* get_all_artists.go
*
* A class for the functionality of the edit bio page
*
* Author: Bethany Bogensberger
*
* Date Modified: 29 March 2017
 */
package app

import (
	"encoding/json"
	"gopkg.in/mgo.v2"
	"net/http"
	
	"log"
)

/**
* Handler for entering a bio and genre.
 */

func GetAllArtists(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent",GetPassword())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("exogig").C("artist")
	log.Println("[DEBUG] inside request for all artists")
	var allArtists []string
	err = collection.Find(nil).Distinct("name",&allArtists)
	check_error(err)
	log.Println("[DEBUG] request body:", allArtists)
	//Return a nil value if the id doesn't have an associated Gig.
	if (len(allArtists)==0) {
		emptyJson, _ := json.Marshal(nil)
		w.Write(emptyJson)
	}

	resultJson, _ := json.Marshal(allArtists)

	//Check to see if the requested ID matches the Gig we provided
	if (len(allArtists) != 0) {
		w.Write(resultJson)
		log.Println("[DEBUG] artist retrieved", allArtists)
	} else {
		log.Println("[DEBUG] artist not updated:", allArtists)
	}
}