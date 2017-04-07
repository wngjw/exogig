import { Injectable } from '@angular/core';
import { Artist } from '../gig/app.gig.users';

@Injectable()

export class artistService {
  private artistObject: Artist;

  public getArtist(): Artist {
    return this.artistObject;
  }

  public setArtist(Artist: Artist) {
    this.artistObject = Artist;
  }

}
