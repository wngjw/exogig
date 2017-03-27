/**
* app.gig.users.ts
*
* Description: A reference class for front-end component data structures
*              Containing the user data structure.
*
* Author: Spencer Ballo
*
* Date Modified: 16 February 2017
*/

export class User {
  private id: number;
  private name: string;
  private type: string;
  private email: string;
  private loggedIn: boolean;
  private vip: boolean;

  setName(name: string) {
    this.name = name;
  }
  setId(id: number){
    this.id = name;
  }
  setLoggedIn(loginStatus: boolean) {
    this.loggedIn = loginStatus;
  }
  setVip(vip: boolean) {
    this.vip = vip;
  }
  setEmail(email: string) {
    this.email = email;
  }
  setType(type: string) {
    this.type = type;
  }
  getName() {
    return this.name;
  }
  getId() {
    return this.id;
  }
  getLoggedIn() {
    return this.loggedIn;
  }
  getVip() {
    return this.vip;
  }
  getType() {
    return this.type;
  }
  getEmail() {
    return this.email;
  }
}

export class Artist {
  private name: string;

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
  }
}

export class Membership {
  private user: string;
  private artist: string;

  getUser() {
    return this.user;
  }
  getArtist() {
    return this.artist;
  }
  setUser(user: string) {
    this.user = user;
  }
  setArtist(artist: string) {
    this.artist = artist;
  }
}
