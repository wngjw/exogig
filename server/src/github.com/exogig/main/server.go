package main

import (
	"fmt"
	"log"
	"net/http"
	//"time"
	"encoding/json"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"github.com/exogig/gig"
)

var IsDrop = true

func check_error(err error) {
	if err != nil {
		panic(err)
	}
}
// This is the setup function that will allow the database to hold our test
// data. This is so that @Spencer will still love us.
func fill_database() {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)

	defer session.Close()

	err = session.DB("test").DropDatabase()
	check_error(err)

	collection := session.DB("test").C("songs")

	index := mgo.Index{
		Key:        []string{"SetListName"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}

	err = collection.EnsureIndex(index)
	check_error(err)

	/* ADDING ALL THE MUTHAFUCKIN' DATA */
	kendrick_set_1 := gig.Set {
		SetName:"kendrick_section_80",
		SongsInSet:[]gig.Song {
			{Name:"Fuck Your Ethnicity", Rating:5}, {Name:"Hol' Up", Rating:5},
			{Name:"A.D.H.D", Rating:5}, {Name:"No Make-Up (Her Vice)", Rating:12},
			{Name:"Tammy's Song (Her Evils)", Rating:5}, {Name:"Chapter Six", Rating:0},
			{Name:"Ronald Reagan Era", Rating:5}, {Name:"Poe Mans Dreams (His Vice)", Rating:0},
			{Name:"The Spiteful Chant", Rating:5}, {Name:"Chapter Ten", Rating:0},
			{Name:"Keisha's Song (Her Pain)", Rating:5}, {Name:"Rigamortus", Rating:0},
			{Name:"Kush and Corinthians (His Pain)", Rating:5}, {Name:"Blow My High (Members Only)", Rating:0},
			{Name:"Ab-Soul's Outro", Rating:5}, {Name:"HiiiPoWeR", Rating:20},
		},
	}
	kendrick_set_2 := gig.Set {
		SetName:"kendrick_good_kid_maad_city",
		SongsInSet:[]gig.Song {
			{Name:"Sherane a.k.a Master Splinter's Daughter", Rating:5}, {Name:"Bitch, Don't Kill My Vibe", Rating:5},
			{Name:"Backseat Freestyle", Rating:5}, {Name:"The Art of Peer Pressure", Rating:12},
			{Name:"Money Trees", Rating:5}, {Name:"Poetic Justice", Rating:0},
			{Name:"good kid", Rating:5}, {Name:"m.A.A.d city", Rating:0},
			{Name:"Swimming Pools (Drank)" , Rating:5}, {Name:"Sing About Me, I'm Dying of Thirst", Rating:0},
			{Name:"Real", Rating:5}, {Name:"Compton", Rating:0},
		},
	}

	kendrick_set_3 := gig.Set {
		SetName:"kendrick_to_pimp_a_butterfly",
		SongsInSet:[]gig.Song {
			{Name:"Wesley's Theory", Rating:5}, {Name:"For Free? (Interlude)", Rating:5},
			{Name:"King Kunta", Rating:5}, {Name:"Institutionalized", Rating:12},
			{Name:"These Walls", Rating:5}, {Name:"u", Rating:0},
			{Name:"Alright", Rating:5}, {Name:"For Sale? (Interlude)", Rating:0},
			{Name:"Momma" , Rating:5}, {Name:"Hood Politics", Rating:0},
			{Name:"How Much a Dollar Cost", Rating:5}, {Name:"Complexion (A Zulu Love)", Rating:0},
			{Name:"The Blacker the Berry", Rating:5}, {Name:"You Ain't Gotta Lie (Momma Said)", Rating:0},
			{Name:"i", Rating:5}, {Name:"Mortal Man", Rating:0},
		},
	}

	kendrick_set_list := gig.SetList {
		SetListName:"kendrick",
		SetsInSetList: []gig.Set {kendrick_set_1, kendrick_set_2, kendrick_set_3},
	}

	err = collection.Insert(&kendrick_set_list)

	check_error(err)
}

// This SHOULD pull from the database that was filled in fill_database()
func new_handler(w http.ResponseWriter, r *http.Request) {
	session, err := mgo.Dial("127.0.0.1")
	check_error(err)

	defer session.Close()

	session.SetMode(mgo.Monotonic, true)

	collection := session.DB("test").C("songs")

	result := gig.SetList{}
	err = collection.Find(nil).One(&result)
	check_error(err)

	new_result, _ := json.Marshal(result)
	fmt.Fprintf(w, string(new_result))
}

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
	fill_database()
	http.HandleFunc("/1", handler)
	http.HandleFunc("/kendrick", new_handler)
	http.HandleFunc("/2", func(w http.ResponseWriter, r *http.Request) {
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
//	jsonSongList, _ := json.Marshal(slist)
//	fmt.Fprintf(w, string(jsonSongList))
	jsonSongList2, _ := json.Marshal(songLists)
	fmt.Fprintf(w, string(jsonSongList2))
	})

	fs := http.FileServer(http.Dir("../client-build/dist/"))
	http.Handle("/", fs)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
