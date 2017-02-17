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
  private name: string;
  private loggedIn: boolean;
  private vip: boolean;

  setName(incName: string) {
      this.name = incName;
  }
  setLoggedIn(loginStatus: boolean) {
      this.loggedIn = loginStatus;
  }
  setVip(vip: boolean) {
      this.vip = vip;
  }
  getName() {
    return this.name;
  }
  getRating() {
    return this.loggedIn;
  }
  getVip() {
    return this.vip;
  }
}