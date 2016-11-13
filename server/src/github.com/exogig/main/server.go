package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
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
	session, err := mgo.Dial("127Monotonic.0.0.1")
	if err != nil {
		panic(err)
	}

	defer session.Close()

	session.SetMode(mgo.Monotonic, true)

	if IsDrop {
		err = session.DB("test").DropDatabase()
		if err != nil {
			panic(err)
		}
	}

	// Collection  of People
	collection := session.DB("test").C("people")

	// Index
	index := mgo.Index{
		Key:        []string{"name", "phone"},
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
	err = collection.Insert(&Person{Name: "Luke", Phone: "1 360 259 3087", Timestamp: time.Now()},
		&Person{Name: "Dusti", Phone: "1 360 561 3276", Timestamp: time.Now()})

	if err != nil {
		panic(err)
	}

	result := Person{}
	err = collection.Find(bson.M{"name": r.URL.Path[1:]}).Select(bson.M{"phone": ""}).One(&result)

	if err != nil {
		panic(err)
	}

	fmt.Fprintf(w, string(result.Phone))
}

func main() {
	//http.HandleFunc("/", handler)

	http.Handle("/", http.FileServer(http.Dir("/home/group5/exogig/client/html/")))
	log.Fatal(http.ListenAndServe(":8080", nil))

	/*
		// Query One
		result := Person{}
		err = c.Find(bson.M{"name": "Ale"}).Select(bson.M{"phone": 0}).One(&result)
		if err != nil {
			panic(err)
		}
		fmt.Println("Phone", result)

		// Query All
		var results []Person
		err = c.Find(bson.M{"name": "Cla"}).Sort("-timestamp").All(&results)

		if err != nil {
			panic(err)
		}
		fmt.Println("Results All: ", results)

		// Update
		colQuerier := bson.M{"name": "Ale"}
		change := bson.M{"$set": bson.M{"phone": "+86 99 8888 7777", "timestamp": time.Now()}}
		err = c.Update(colQuerier, change)
		if err != nil {
			panic(err)
		}

		// Query All
		err = c.Find(bson.M{"name": "Ale"}).Sort("-timestamp").All(&results)

		if err != nil {
			panic(err)
		}
		fmt.Println("Results All: ", results)
	*/
}
