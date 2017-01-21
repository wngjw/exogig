/**
* app.gig.gig.ts
*
* Description: A reference class for front-end component data structures
*              Contains the TypeScript data structures that match the backend
*              GoLang data structures on the server.
*
* Author: Tony Wang
*
* Date Modified: 21 January 2017
*/

export class Song {
  name: string;
  rating: number;
}

export class SongList {
  listName: string;
  songs: Song[];
}
