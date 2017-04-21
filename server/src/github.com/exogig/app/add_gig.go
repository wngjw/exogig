/*
* add_gig.go
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

	"log"

	"gopkg.in/mgo.v2/bson"
)

func AddGigToServer(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent", GetPassword())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("exogig").C("gigs")

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	// The new membership to be added to the database
	var rec_gig gig.Gig
	// Decode the JSON, and return error
	err = decoder.Decode(&rec_gig)
	check_error(err)
	defer r.Body.Close()
	var potential_conflict gig.Gig
	err = collection.Find(bson.M{"gigid": rec_gig.GigId}).One(&potential_conflict)

	if potential_conflict.GigId != "" {
		err = collection.Remove(bson.M{"gigid": rec_gig.GigId})
		check_error(err)
	}

	err = collection.Insert(&rec_gig)
	check_error(err)
}

func RemoveGig(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent", GetPassword())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("exogig").C("gigs")

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	// The new membership to be added to the database
	var rec_gig string
	// Decode the JSON, and return error
	err = decoder.Decode(&rec_gig)
	check_error(err)
	defer r.Body.Close()
	var gig_to_delete gig.Gig
	err = collection.Find(bson.M{"gigid": rec_gig}).One(&gig_to_delete)

	if gig_to_delete.GigId != "" {
		err = collection.Remove(bson.M{"gigid": rec_gig})
		check_error(err)
	}
}

/**
* Handler for entering a bio and genre.
 */

func AddGig(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent", GetPassword())
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
	err = collection.Find(bson.M{"name": artist.Name}).One(&old_artist)
	check_error(err)
	log.Println("[DEBUG] previous status:", old_artist)
	// inserts membership into the database
	old_artist.Gigs = artist.Gigs

	err = collection.Update(bson.M{"name": artist.Name}, bson.M{"$set": bson.M{"gigs": old_artist.Gigs}})
	check_error(err)
	log.Println("[DEBUG] update:", old_artist)
	//Return a nil value if the id doesn't have an associated Gig.
	if len(artist.Gigs) == 0 {
		emptyJson, _ := json.Marshal(nil)
		w.Write(emptyJson)
	}

	resultJson, _ := json.Marshal(old_artist)

	//Check to see if the requested ID matches the Gig we provided
	if len(artist.Bio) != 0 || len(artist.Genre) != 0 {
		w.Write(resultJson)
		log.Println("[DEBUG] artist updated", old_artist.Gigs)
	} else {
		log.Println("[DEBUG] artist not updated:", artist)
	}
}
