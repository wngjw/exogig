package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
	"encoding/json"

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

func handler(w http.ResponseWriter, r *http.Request) {
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

	// Collection  of People
	//collection := session.DB("test").C("people")
	collection := session.DB("test2").C("songs")

	// Index
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
			{Name:"SilverScrapes", Rating:0}, {Name:"EyeOfTheTiger", Rating:0},
		},
	}
	err = collection.Insert(&slist)

	if err != nil {
		panic(err)
	}

	result := gig.SongList{}
	err = collection.Find(bson.M{"listname": r.URL.Path[1:]}).Select(bson.M{"songs": ""}).One(&result)
	fmt.Fprintf(w, string(gig.GetSongNames(result.Songs)))

	if err != nil {
		panic(err)
	}
}

func main() {
	http.HandleFunc("/1", handler)
	http.HandleFunc("/2", func(w http.ResponseWriter, r *http.Request) {
	slist := gig.SongList {
		ListName:"1",
		Songs:[]gig.Song {
			{Name:"SilverScrapes", Rating:0}, {Name:"EyeOfTheTiger", Rating:0},
		},
	}
	jsonSongList, _ := json.Marshal(slist)
	fmt.Fprintf(w, string(jsonSongList))
	})
	fs := http.FileServer(http.Dir("../client-build/dist/"))
	http.Handle("/", fs)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
