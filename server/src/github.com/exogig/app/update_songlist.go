/*
* update_songlist.go
*
* A class for the functionality of the edit bio page
*
* Author: Bethany Bogensberger
*
* Date Modified: 4 April 2017
 */
package app

import (
	"encoding/json"
	"github.com/exogig/gig"
	"gopkg.in/mgo.v2"
	"net/http"
	"gopkg.in/mgo.v2/bson"
	"log"
)



/**
* Handler for entering a bio and genre.
 */

func UpdateSonglist(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent",GetPassword())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("exogig").C("artist")

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	// The new membership to be added to the database
	var artist gig.Artist
	// Decode the JSON, and return error
	err = decoder.Decode(&artist)
	check_error(err)

	defer r.Body.Close()
	log.Println("[DEBUG] request body:", artist)

	err = collection.Update(bson.M{"name":artist.Name},bson.M{"$set": bson.M{"songlist":artist.Songlist}})
	check_error(err)
	err = collection.Find(bson.M{"name":artist.Name}).One(&artist)
	check_error(err)
	log.Println("[DEBUG] updated artist:", artist)
	//Return a nil value if the id doesn't have an associated Gig.
	if (len(artist.Songlist) == 0 ) {
		emptyJson, _ := json.Marshal(nil)
		w.Write(emptyJson)
	}

	resultJson, _ := json.Marshal(artist)

	//Check to see if the requested ID matches the Gig we provided
	if (len(artist.Songlist) != 0 ) {
		w.Write(resultJson)
		log.Println("[DEBUG] artist updated", artist)
	} else {
		log.Println("[DEBUG] artist not updated:", artist)
	}
}
