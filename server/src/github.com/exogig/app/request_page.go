/**
* request_page.go
*
* A class for the functionality of the request page.
*
* Author: Tony Wang
*
* Date Modified: 8 Feb 2017
*/
package app

import(
	"net/http"
	"encoding/json"
	"log"
  "github.com/exogig/gig"
	"gopkg.in/mgo.v2"
)

func RequestPageHandler(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)
	err = session.DB("exogig").Login("gustudent",GetPassword())
	check_error(err)
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	//collection := session.DB("exogig").C("gigs")

	// Creates the decoder for the http request body
	decoder := json.NewDecoder(r.Body)
	var requestedSong gig.Request
	err = decoder.Decode(&requestedSong)

	log.Println(requestedSong)
	log.Println(requestedSong.RequestedSongName)

  slist := gig.SongList {
    ListName:"Song List 1",
    Songs:[]gig.Song {
      {Name:"SilverScrapes", Rating:0}, {Name:"EyeOfTheTiger", Rating:0},
    },
  }
  slist2 := gig.SongList {
    ListName:"Song List 2",
    Songs:[]gig.Song {
      {Name:"MyHeartWillGoOn", Rating:0}, {Name:"OceanMan", Rating:0},
    },
  }
  var songLists = []gig.SongList{slist, slist2}
  jsonSongList, _ := json.Marshal(songLists)
  w.Write(jsonSongList)
}
