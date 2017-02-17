/**
* home_page.go
*
* A class for the functionality of the home page.
*
* Author: Tony Wang
*
* Date Modified: 8 Feb 2017
*/
package app

import (
  "fmt"
	"encoding/json"
  "net/http"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
  "github.com/exogig/gig"
)

func check_error(err error) {
	if err != nil {
		panic(err)
	}
}

/**
* Handler for entering a gig code.
*/
// This SHOULD pull from the database that was filled in fill_database()
func GigCodeHandler(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("test").C("songs")
	result := gig.Gig{}

	//This will look at the URL query, and find the dictionary value of "key"
	//This is the key that they should recieve the Gig information for it it exists
	requestedID := r.URL.Query().Get("key")

	// Searches the database for the key
	err = collection.Find(bson.M{"gigid": requestedID}).One(&result)

	if len(requestedID) == 0 {
		emptyJson, _ := json.Marshal(nil)
		//Return a nil value if the id doesn't have an associated Gig.
		w.Write(emptyJson)
	}

	resultJson, _ := json.Marshal(result)

	//Check to see if the requested ID matches the Gig we provided
	if requestedID == result.GigID {
		w.Write(resultJson)
		fmt.Println("[DEBUG] Found gig: ", requestedID)
	} else {
		fmt.Println("[DEBUG] Gig not found:", requestedID)
	}
}
