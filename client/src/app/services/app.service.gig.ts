import { Injectable } from '@angular/core';
import { Gig } from '../gig/app.gig.gig';

@Injectable()

export class gigService {
  private gigObject: Gig;

  public getGig(): Gig {
    return this.gigObject;
  }

  public setGig(Gig: Gig) {
    this.gigObject = Gig;
  }

}
