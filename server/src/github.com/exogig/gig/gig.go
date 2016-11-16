/**
 * gig.go
 *
 * Contains structures and operations related to a gig
 *
 * Author: Tony Wang
 *
 * Date Modified: 15 Nov 2016
 */
package gig

/*
 * Description:
 *     Represents a single Song
 * Members:
 *     Name the name of the song
 */
type Song struct {
  Name string
}

/*
 * Description:
 *     Represents a song list
 * Members:
 *    Songs the list, in array format, of songs
 */
 type SongList struct {
   ListName string
   Songs []Song
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
