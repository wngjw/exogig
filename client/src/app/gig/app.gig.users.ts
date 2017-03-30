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
import { Gig,SongList,SetList } from '../gig/app.gig.gig'

export class User {
  private id: number;
  private name: string;
  private type: string;
  private email: string;
  private loggedIn: boolean;
  private vip: boolean;
  private artist: boolean;

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
  setArtist(artist: boolean) {
    this.artist = artist;
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
  isArtist() {
    return this.artist;
  }
}

export class Artist {
    gigs:Gig[];
    songlist:SongList;
    setlists:SetList[];
    Bio:string;
    picture:string;
    Name:string;
    Genre:string;
 getBio() {
    return this.Bio;
  }
  setBio(bio: string) {
    this.Bio = bio;
  }
  getGenre() {
    return this.Genre;
  }
  setGenre(genre: string) {
    this.Genre = genre;
  }
  getName() {
    return this.Name;
  }
  setName(name: string) {
    this.Name = name;
  }
}

export class Membership {
  private artist: string;
  private email: string;

  getUser() {
    return this.email;
  }
  getArtist() {
    return this.artist;
  }
  setEmail(email: string) {
    this.email = email;
  }
  setArtist(artist: string) {
    this.artist = artist;
  }
}
