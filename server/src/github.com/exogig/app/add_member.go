/*
* add_member.go
*
* A class for the functionality of the add_membership page
*
* Author: Bethany Bogensberger
*
* Date Modified: 28 March 2017
 */
package app

import (
	"encoding/json"
	"github.com/exogig/gig"
	"gopkg.in/mgo.v2"
	
	"log"
	"net/http"
)



/**
* Handler for entering a bio and genre.
 */

func AddMember(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent",GetPassword())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("exogig").C("membership")

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	// The new membership to be added to the database
	var new_mem gig.Membership
	// Decode the JSON, and return error
	err = decoder.Decode(&new_mem)
	if err != nil {
		panic(err)
	}
	defer r.Body.Close()
	log.Println("[DEBUG] request body:", new_mem)

	// inserts membership into the database
	err = collection.Insert(&new_mem)
    // Searches the database for the band
    
    
	//Return a nil value if the id doesn't have an associated Gig.
	if (len(new_mem.Artist) == 0 || len(new_mem.Email) == 0) {
		emptyJson, _ := json.Marshal(nil)
		w.Write(emptyJson)
	}

	resultJson, _ := json.Marshal(new_mem)

	//Check to see if the requested ID matches the Gig we provided
	if (len(new_mem.Artist) != 0 && len(new_mem.Email) != 0) {
		w.Write(resultJson)
		log.Println("[DEBUG] membership added", new_mem)
	} else {
		log.Println("[DEBUG] membership not added:", new_mem)
	}
}
