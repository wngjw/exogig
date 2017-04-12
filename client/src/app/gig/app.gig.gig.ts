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
  Name: string;
  Rating: number;
  getName() {
    return this.Name;
  }
  getRating() {
    return this.Rating;
  }
}


export class Set {
  SongsInSet: Song[];
  SetName: string;
  getSongsInSet() {
    return this.SongsInSet;
  }
  getSetName() {
    return this.SetName;
  }
}

export class SetList {
  SetListName: string;
  SetsInSetList: Set[] = [];
  

  getSetsInSetList() {
    return this.SetsInSetList;
  }
  getSetListName() {
    return this.SetListName;
  }
  addSet(set:Set){
    this.SetsInSetList.push(set);
  }
}

export class Request {
  RequestedSongName: string;
  NumTimesRequested: number;
  getRequestedSong() {
    return this.RequestedSongName;
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
