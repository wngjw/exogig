/*
* update_artist.go
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
	"github.com/exogig/gig"
	"gopkg.in/mgo.v2"
	"net/http"
	"gopkg.in/mgo.v2/bson"
	"log"
)



/**
* Handler for entering a bio and genre.
 */

func UpdateBio(w http.ResponseWriter, r *http.Request) {
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
	
	var old_artist gig.Artist
	err = collection.Find(bson.M{"name":artist.Name}).One(&old_artist)
	check_error(err)
	// inserts membership into the database
	//old_artist.Bio = artist.Bio
	//old_artist.Genre = artist.Genre
	log.Println("[DEBUG] old artist:", old_artist)
	
	err = collection.Update(bson.M{"name":artist.Name},bson.M{"$set": bson.M{"bio":artist.Bio,"genre":artist.Genre}})
	check_error(err)
	err = collection.Find(bson.M{"name":artist.Name}).One(&old_artist)
	check_error(err)
	log.Println("[DEBUG] updated artist:", old_artist)
	//Return a nil value if the id doesn't have an associated Gig.
	if (len(artist.Bio) == 0 && len(artist.Genre) == 0) {
		emptyJson, _ := json.Marshal(nil)
		w.Write(emptyJson)
	}

	resultJson, _ := json.Marshal(old_artist)

	//Check to see if the requested ID matches the Gig we provided
	if (len(artist.Bio) != 0 || len(artist.Genre) != 0) {
		w.Write(resultJson)
		log.Println("[DEBUG] artist updated", artist)
	} else {
		log.Println("[DEBUG] artist not updated:", artist)
	}
}
