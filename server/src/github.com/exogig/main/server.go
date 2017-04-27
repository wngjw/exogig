package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/exogig/app"
	"github.com/exogig/chat"
	"github.com/exogig/gig"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

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

	app.SavePassword()
	err = session.DB("exogig").Login("gustudent", app.GetPassword())
	check_error(err)

	defer session.Close()

	collection := session.DB("exogig").C("gigs")

	index := mgo.Index{
		Key:        []string{"gigid"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}

	err = collection.EnsureIndex(index)
	check_error(err)

	var result gig.Gig
	err = collection.Find(bson.M{"gigid": "KDOT"}).One(&result)
	check_error(err)

	if result.GigName == "" {
		fmt.Println("No gig found adding kendrick")
		kendrick_set_1 := gig.Set{
			SetName: "Section.80",
			SongsInSet: []gig.Song{
				{Name: "Your Ethnicity", Rating: 5}, {Name: "Hol' Up", Rating: 5},
				{Name: "A.D.H.D", Rating: 5}, {Name: "No Make-Up (Her Vice)", Rating: 12},
				{Name: "Tammy's Song (Her Evils)", Rating: 5}, {Name: "Chapter Six", Rating: 0},
				{Name: "Ronald Reagan Era", Rating: 5}, {Name: "Poe Mans Dreams (His Vice)", Rating: 0},
				{Name: "The Spiteful Chant", Rating: 5}, {Name: "Chapter Ten", Rating: 0},
				{Name: "Keisha's Song (Her Pain)", Rating: 5}, {Name: "Rigamortus", Rating: 0},
				{Name: "Kush and Corinthians (His Pain)", Rating: 5}, {Name: "Blow My High (Members Only)", Rating: 0},
				{Name: "Ab-Soul's Outro", Rating: 5}, {Name: "HiiiPoWeR", Rating: 20},
			},
		}
		kendrick_set_2 := gig.Set{
			SetName: "Good Kid, M.A.A.D. City",
			SongsInSet: []gig.Song{
				{Name: "Sherane a.k.a Master Splinter's Daughter", Rating: 5}, {Name: "Don't Kill My Vibe", Rating: 5},
				{Name: "Backseat Freestyle", Rating: 5}, {Name: "The Art of Peer Pressure", Rating: 12},
				{Name: "Money Trees", Rating: 5}, {Name: "Poetic Justice", Rating: 0},
				{Name: "good kid", Rating: 5}, {Name: "m.A.A.d city", Rating: 0},
				{Name: "Swimming Pools (Drank)", Rating: 5}, {Name: "Sing About Me, I'm Dying of Thirst", Rating: 0},
				{Name: "Real", Rating: 5}, {Name: "Compton", Rating: 0},
			},
		}

		kendrick_set_3 := gig.Set{
			SetName: "To Pimp a Butterfly",
			SongsInSet: []gig.Song{
				{Name: "Wesley's Theory", Rating: 5}, {Name: "For Free? (Interlude)", Rating: 5},
				{Name: "King Kunta", Rating: 5}, {Name: "Institutionalized", Rating: 12},
				{Name: "These Walls", Rating: 5}, {Name: "u", Rating: 0},
				{Name: "Alright", Rating: 5}, {Name: "For Sale? (Interlude)", Rating: 0},
				{Name: "Momma", Rating: 5}, {Name: "Hood Politics", Rating: 0},
				{Name: "How Much a Dollar Cost", Rating: 5}, {Name: "Complexion (A Zulu Love)", Rating: 0},
				{Name: "The Blacker the Berry", Rating: 5}, {Name: "You Ain't Gotta Lie (Momma Said)", Rating: 0},
				{Name: "i", Rating: 5}, {Name: "Mortal Man", Rating: 0},
			},
		}

		kendrick_set_list := gig.SetList{
			SetListName:   "kendrick",
			SetsInSetList: []gig.Set{kendrick_set_1, kendrick_set_2, kendrick_set_3},
		}

		kendricks_gig := gig.Gig{
			GigId:          "KDOT",
			GigName:        "The Blacker the Berry",
			GigTime:        "21:00",
			GigDate:        "2017-05-14",
			GigLocation:    "Knitting Factory",
			GigSetList:     kendrick_set_list,
			GigRequestList: []gig.Request{},
		}

		err = collection.Insert(&kendricks_gig)
		check_error(err)
	} else {
		fmt.Println("Gig found not dropping database")
	}
}

func generate_gig_id(w http.ResponseWriter, r *http.Request) {
	rand.Seed(time.Now().UTC().UnixNano())
	// This excludes mispercieved characters JL10
	const chars = "ABCDEFGHIKMNOPQRSTYUVWXYZ23456789"
	result := make([]byte, 4)
	for i := 0; i < 4; i++ {
		result[i] = chars[rand.Intn(len(chars))]
	}
	log.Println("[DEBUG] code generated:", string(result))
	resultJson, _ := json.Marshal(string(result))
	w.Write(resultJson)
}

func main() {
	fill_database()
	http.HandleFunc("/gigcode", app.GigCodeHandler)
	http.HandleFunc("/generate", generate_gig_id)
	http.HandleFunc("/request", app.RequestPageHandler)
	http.HandleFunc("/addmem", app.AddMember)
	http.HandleFunc("/findmem", app.FindMembership)
	http.HandleFunc("/editbio", app.UpdateBio)
	http.HandleFunc("/getartist", app.RetrieveArtist)
	http.HandleFunc("/addartist", app.AddArtist)
	http.HandleFunc("/addgig", app.AddGig)
	http.HandleFunc("/addgigtoserver", app.AddGigToServer)
	http.HandleFunc("/removegig", app.RemoveGig)
	http.HandleFunc("/updatesonglist", app.UpdateSonglist)
	http.HandleFunc("/findmeminband", app.FindMemInBand)
	http.HandleFunc("/getallartists", app.GetAllArtists)
	http.HandleFunc("/updaterequests", app.UpdateRequests)

	chatserver := chat.NewServer("/chat", ":8082")
	go chatserver.Listen()

	http.HandleFunc("/addsetlist", app.AddSetList)

	fs := http.FileServer(http.Dir("../client/dist/"))
	http.Handle("/", fs)
	log.Fatal(http.ListenAndServe(":8081", nil))

}
