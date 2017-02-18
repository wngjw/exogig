import { Injectable } from '@angular/core';
import { User } from '../gig/app.gig.users';

@Injectable()

export class userService {
    private userObject;

    public getUser() {
        return this.userObject;
    }

    public setUser(User: User) {
        this.userObject = User;
    }

}