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
  "github.com/exogig/gig"
)

func RequestPageHandler(w http.ResponseWriter, r *http.Request) {
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
