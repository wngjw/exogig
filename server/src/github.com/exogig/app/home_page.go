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
	"strings"
)

func check_error(err error) {
	if err != nil {
		panic(err)
	}
}

var password string

func SavePassword(){
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Please enter the Database password: ")
	text, _ := reader.ReadString('\n')
	password = text[0:len(text)-1]
}

func GetPassword() (string) {
	return password
}

/**
* Handler for entering a gig code.
 */
// This code currently pulls from the database in fill_database()
func GigCodeHandler(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent",GetPassword())
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

  //format the input so that characters correct to gigcodes
	requestedId = strings.ToUpper(requestedId)
	requestedId = strings.Replace(requestedId,"J","I",-1)
	requestedId = strings.Replace(requestedId,"L","I",-1)
	requestedId = strings.Replace(requestedId,"1","I",-1)
	requestedId = strings.Replace(requestedId,"0","O",-1)

	if err != nil {
		panic(err)
	}
	defer r.Body.Close()

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
	if strings.ToUpper(requestedId) == strings.ToUpper(result.GigId) {
		w.Write(resultJson)
		log.Println("[DEBUG] found requested gig:", requestedId)
	} else {
		log.Println("[DEBUG] gig not found:", requestedId)
	}
}
