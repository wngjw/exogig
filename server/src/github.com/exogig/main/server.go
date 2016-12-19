package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"github.com/exogig/gig"
)

type Person struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	Name      string
	Phone     string
	Timestamp time.Time
}

var (
	IsDrop = true
)

func getSongList(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	if err != nil {
		panic(err)
	}

	defer session.Close()

	session.SetMode(mgo.Monotonic, true)

	if IsDrop {
		err = session.DB("test2").DropDatabase()
		if err != nil {
			panic(err)
		}
	}
	
	collection := session.DB("test2").C("songs")
	
	var result
	err = collection.Find(bson.M{"listname": r.URL.Path[1:]}).Select(bson.M{"songs": ""}).One(&result)

	if err != nil {
		panic(err)
	}
	
	fmt.Fprintf(w, string(gig.GetSongNames(result.Songs)))
}

func setup() {
	session, err := mgo.Dial("127.0.0.1")
	if err != nil {
		panic(err)
	}

	defer session.Close()

	session.SetMode(mgo.Monotonic, true)

	if IsDrop {
		err = session.DB("test2").DropDatabase()
		if err != nil {
			panic(err)
		}
	}
	
	collection := session.DB("test2").C("songs")
	
	index := mgo.Index{
		Key:        []string{"listname"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	
	err = collection.EnsureIndex(index)
	if err != nil {
		panic(err)
	}
	
	// Inserts data
	slist := gig.SongList {
		ListName:"1",
		Songs:[]gig.Song {
			{Name:"SilverScrapes", Rating:5}, {Name:"EyeOfTheTiger", Rating:4},
		},
	}
	err = collection.Insert(&slist)

	if err != nil {
		panic(err)
	}
}

func main() {
	setup()
	http.HandleFunc("/songlist", getSongList)
	fs := http.FileServer(http.Dir("../client/html/"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	log.Fatal(http.ListenAndServe(":8000", nil))
}
