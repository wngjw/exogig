/** filepath server/src/github.com/exogig/main/songs.go
  * Author Luke  
  * Date modified 2016/11/13
  * 
  * This file contains classes for the basics of songs and set list for our
  * mongodb Database and go webserver
**/

type Song struct {
    name        string
}

type Songlist struct {
    songs       []Song
    id          string
}

type Set struct {
    songs       []Song
    setNumber   int
    id          string
}

type Setlist struct {
    sets        []Set
    name        string
    numSets     int
}

type Rating struct {
    score       bool
    ratedSong   Song
}

type Request struct {
    requestedSong       Song
    requestingUserName  String
}
