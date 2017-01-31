/**
 * gig.go
 *
 * Contains structures and operations related to a gig
 *
 * Authors: Tony Wang, Luke Johnson
 *
 * Date Modified: 02 Dec 2016
 */
package gig

/*
 * Description:
 *    Represents a single Song
 * Members:
 *    Name: the name of the song
 *    Rating: 0 for unrated, 1 for bad, 2 for good
 */
type Song struct {
  Name string
  Rating int
}

/*
 * Description:
 *    A comparison function between songs to check
 *    if they are the same.
 * Use:
 *    songA.CompareSong(&songB)
 * Returns:
 *    true if songs are equal
 *    false otherwise
 */
func (a *Song) CompareSong(b *Song) (_ bool) {
  if (a == b) {
    return true
  }
  if a.Name != b.Name {
    return
  }
  if a.Rating != b.Rating {
    return
  }
  return true
}

/*
 * Description:
 *    Represents a song list
 * Members:
 *    Songs: the list, in array format, of songs
 */
 type SongList struct {
   ListName string
   Songs []Song
 }

/*
 * Description:
 *    Represents a set
 * Members:
 *    Songs: the array of songs in the set
 *    SetName: a name for the set
 *    Id: a unique identifier for the set
 */
 type Set struct {
     SetName        string
     SongsInSet     []Song
 }

/*
 * Description:
 *    A comparison function between sets to check
 *    if they are the same.
 * Use:
 *    setA.CompareSet(&setB)
 * Returns:
 *    true if sets are equal
 *    false otherwise
 */
func (a *Set) CompareSet(b *Set) (_ bool) {
  if (a == b) {
    return true
  }
  if a.SetName != b.SetName {
    return
  }
  for i := range a.SongsInSet {
    if a.SongsInSet[i] != b.SongsInSet[i] {
      return
    }
  }
  return true
}

/*
 * Description:
 *    Represents a set list as a list of sets
 * Members:
 *    Sets: the array of sets in the set list
 *    SetListName: a name for the set list
 *    Id: a unique identifier for the set list
 */
 type SetList struct {
     SetListName    string
     SetsInSetList  []Set

 }

 /*
  * Description:
  *    A comparison function between set lists to check
  *    if they are the same.
  * Use:
  *    setListA.CompareSetLists(&setListB)
  * Returns:
  *    true if sets are equal
  *    false otherwise
  */
 func (a *SetList) CompareSetList(b *SetList) (_ bool) {
   if (a == b) {
     return true
   }
   if a.SetListName != b.SetListName {
     return
   }
   for i := range a.SetsInSetList {
     if a.SetsInSetList[i].CompareSet(&b.SetsInSetList[i]) == false {
       return
     }
   }
   return true
 }

/*
 * Description:
 *    Represents a request for a song
 * Members:
 *    RequestedSong: the song being requested
 */
 type Request struct {
     RequestedSong       Song
 }

/*
 * Description:
 *    Represents an gig (live event)
 * Members:
 *    setList: the list of sets for the gig
 *    name: the name of the gig
 *    time: the time of day of the gig
 *    date: the date of the gig
 *    location: the location of the gig
 *    TODO: ratings: a collection of ratings and associated songs for the gig
 *    requests: a collection of requests for the gig
 */
 type Gig struct {
     GigID          string
     GigSetList     SetList
     GigName        string
     GigTime        string
     GigDate        string
     GigLocation    string
     GigRequestList []Request
 }

/*
 * Description:
 *     Gets the names of the songs in a song list
 * Parameters:
 *     songs the list of songs
 * TODO: Use a byte buffer to handle concatenation to
 * avoid creating a new string object every time
 */
func GetSongNames(songs []Song) string {
  s := ""
  for _, song := range songs {
    s += song.Name + " "
  }
  return s
}
