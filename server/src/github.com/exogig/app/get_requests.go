/*
* get_requests.go
*
* A class for the functionality of the gigviewer page
*
* Author: Bethany Bogensberger
*
* Date Modified: 27 April 2017
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

func UpdateRequests(w http.ResponseWriter, r *http.Request) {
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
	var gigId string
	// Decode the JSON, and return error
	err = decoder.Decode(&gigId)
	check_error(err)
	defer r.Body.Close()
	var currentGig gig.Gig
	err = collection.Find(bson.M{"gigid": gigId}).One(&currentGig)
    check_error(err)
	
	log.Println("[DEBUG] before marshal", currentGig.GigRequestList)
	resultJson, _ := json.Marshal(currentGig.GigRequestList)
	log.Println("[DEBUG] after marshal", currentGig.GigRequestList)
	//Check to see if the requested ID matches the Gig we provided
	if len(currentGig.GigRequestList) != 0 {
		w.Write(resultJson)
		log.Println("[DEBUG] requests updated", currentGig.GigRequestList)
	} else {
		log.Println("[DEBUG] requests not updated:", currentGig.GigRequestList)
	}
}