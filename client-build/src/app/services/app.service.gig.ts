import { Injectable } from '@angular/core';

@Injectable()

export class gigService {
    private gigObject;

    public getGig() {
        return this.gigObject;
    }

    public setGig(Gig: Object) {
        this.gigObject = Gig;
    }

}