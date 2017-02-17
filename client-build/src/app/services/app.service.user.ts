import { Injectable } from '@angular/core';
import { User } from '../gig/app.gig.users';

@Injectable()

export class userService {
    private userObject;

    public getGig() {
        return this.userObject;
    }

    public setGig(User: User) {
        this.userObject = User;
    }

}