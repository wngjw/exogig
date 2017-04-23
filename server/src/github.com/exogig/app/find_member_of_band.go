/*
* find_member_of_band.go
*
* A class for the functionality of the add_membership page
*
* Author: Bethany Bogensberger
*
* Date Modified: 28 March 2017
 */
package app

import (
	"fmt"
	"encoding/json"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
)



/**
* Handler for entering a bio and genre.
 */


func FindMemInBand(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent",GetPassword())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("exogig").C("membership")

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	fmt.Print("in find membership before decoder")
	// The user that is logged in
	var artist_name string
	// Decode the JSON, and return error
	err = decoder.Decode(&artist_name)
	check_error(err)

	defer r.Body.Close()
	fmt.Print("[DEBUG] request body:", artist_name)

	// Create the variable to store the gig being searched for
	var results []string
	// this returns a list of band names that the user is a member of.
	// .Distinct allows filtering so we don't collect entire instance
	err = collection.Find(bson.M{"artist":artist_name}).Distinct("email",&results)
	log.Println("[DEBUG] found bands:", results)

	//Return a nil value if the id doesn't have an associated Gig.
	if len(results) == 0 {
		emptyJson, _ := json.Marshal(nil)
		w.Write(emptyJson)
	}else{
		resultJson, _ := json.Marshal(results)
		w.Write(resultJson)
	}
}