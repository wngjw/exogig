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
  getName() {
    return this.name;
  }
  getRating() {
    return this.rating;
  }
}


export class Set {
  songsInSet: Song[];
  setName: string;
  getSongsInSet() {
    return this.songsInSet;
  }
  getSetName() {
    return this.setName;
  }
}

export class SetList {
  setsInSetList: Set[];
  setListName: string;
  getSetsInSetList() {
    return this.setsInSetList;
  }
  getSetListName() {
    return this.setListName;
  }
}

export class Request {
  requestedSongName: string;
  numTimesRequested: number;
  getRequestedSong() {
    return this.requestedSongName;
  }
}

export class Gig {
  GigId: string;
  GigSetList: SetList;
  GigName: string;
  GigTime: string;
  GigDate: string;
  GigLocation: string;
  GigRequestList: Request[];
}
