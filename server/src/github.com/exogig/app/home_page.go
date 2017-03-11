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
	"encoding/json"
	"github.com/exogig/gig"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"bufio"
	"fmt"
	"os"
	"net/http"
)

func check_error(err error) {
	if err != nil {
		panic(err)
	}
}

func get_input() (string) {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Please enter the Database password: ")
	text, _ := reader.ReadString('\n')
	fmt.Print("111" + text[0:len(text)-1] + "222")
	return text[0:len(text)-1]
}

/**
* Handler for entering a gig code.
 */
// This code currently pulls from the database in fill_database()
func GigCodeHandler(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent",get_input())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection := session.DB("exogig").C("gigs")

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	// The "key" or "gig code" input from the login page
	var requestedId string
	// Decode the JSON, and return error
	err = decoder.Decode(&requestedId)
	if err != nil {
		panic(err)
	}
	defer r.Body.Close()
	log.Println("[DEBUG] request body:", requestedId)

	// Create the variable to store the gig being searched for
	var result gig.Gig
	// Searches the database for the key
	err = collection.Find(bson.M{"gigid": requestedId}).One(&result)

	//Return a nil value if the id doesn't have an associated Gig.
	if len(requestedId) == 0 {
		emptyJson, _ := json.Marshal(nil)
		w.Write(emptyJson)
	}

	resultJson, _ := json.Marshal(result)

	//Check to see if the requested ID matches the Gig we provided
	if requestedId == result.GigId {
		w.Write(resultJson)
		log.Println("[DEBUG] found gig:", requestedId)
	} else {
		log.Println("[DEBUG] gig not found:", requestedId)
	}
}
