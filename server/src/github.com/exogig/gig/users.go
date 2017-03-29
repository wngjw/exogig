/** filepath server/src/github.com/exogig/gig/users.go
  * Author Luke
  * Date modified 2016/11/16
  *
  * This file contains classes for the users for our
  * mongodb Database and go webserver
**/

package gig

type User struct {
    name        string
    clientId    string
}

type Artist struct {
    gigs        []Gig
    songlist    SongList
    setlists    []SetList
    Bio         string
    picture     string
    Name        string
    Genre       string
}
type Membership struct {
    Artist      string
    Email       string
}
