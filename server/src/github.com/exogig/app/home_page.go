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
func GigCodeHandler(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("127.0.0.1")
  check_error(err)
  defer session.Close()
  collection := session.DB("gigsearch").C("gigs")
  //Call to ParseForm makes form fields available.
  err = r.ParseForm()
  check_error(err)
  result := gig.Gig{}
  err = collection.Find(bson.M{"gigid":"s3xy"}).One(&result)
  check_error(err)
}
