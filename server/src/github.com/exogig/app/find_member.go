/*
* find_member.go
*
* A class for the functionality of the add_membership page
*
* Author: Bethany Bogensberger
*
* Date Modified: 23 March 2017
 */
package app

import (
	"encoding/json"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
)



/**
* Handler for entering a bio and genre.
 */


func FindMembership(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("exogig").C("membership")
	

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	// The "key" or "gig code" input from the login page
	var user_name string
	// Decode the JSON, and return error
	err = decoder.Decode(&user_name)
	if err != nil {
		panic(err)
	}
	defer r.Body.Close()
	log.Println("[DEBUG] request body:", user_name)

	// Create the variable to store the gig being searched for
	var results []string
	// inserts membership into the database
	err = collection.Find(bson.M{"artist": user_name}).All(&results)
	log.Println("[DEBUG] found bands:", results)

	//Return a nil value if the id doesn't have an associated Gig.
	if len(results) == 0 {
		emptyJson, _ := json.Marshal(nil)
		w.Write(emptyJson)
	}
	
	resultJson, _ := json.Marshal(results)
	w.Write(resultJson)
	
		
	
}
