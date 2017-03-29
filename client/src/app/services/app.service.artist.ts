import { Injectable } from '@angular/core';
import { Artist } from '../gig/app.gig.users';

@Injectable()

export class artistService {
  private artistObject;

  public getArtist() {
    return this.artistObject;
  }

  public setArtist(Artist: Artist) {
    this.artistObject = Artist;
  }

}