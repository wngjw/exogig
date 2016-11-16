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

	// Insert Data
	//err = collection.Insert(&Person{Name: "Luke", Phone: "1 360 259 3087", Timestamp: time.Now()},
	//	&Person{Name: "Dusti", Phone: "1 360 561 3276", Timestamp: time.Now()})
	slist := gig.SongList {
		ListName: "1",
		Songs: []gig.Song{
			{"SilverScrapes"},
			{"EyeOfTheTiger"},
		},
	}
	err = collection.Insert(&slist)

	if err != nil {
		panic(err)
	}

	result := slist
	fmt.Fprintf(w, string(gig.GetSongNames(result.Songs)))
	err = collection.Find(bson.M{"listname": r.URL.Path[1:]}).Select(bson.M{"songs": ""}).One(&result)

	if err != nil {
		panic(err)
	}
}

func main() {
	http.HandleFunc("/", handler)

	//http.Handle("/", http.FileServer(http.Dir("../../../client/")))
	log.Fatal(http.ListenAndServe(":8000", nil))
}
