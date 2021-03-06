/**
* login.ts
* Description: Handles logging in, or joining a Gig.
* Author: Spencer Ballo, Bethany Bosenberger, Luke Johnson
* Date Modified: 16 February 2017
*/

import { Input, Output, Component, Directive, Injectable, EventEmitter, NgZone } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize';
import { Observable } from 'rxjs';
import { gigService } from '../services/app.service.gig';
import { Gig } from '../gig/app.gig.gig';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';
import { WindowRef } from '../gig/app.gig.window';

declare var gapi: any;


@Component({
 	selector: 'login-page',
  templateUrl: '../html/login_html.html',
  outputs: ['notify']
})

export class AppLoginComponent {
  notify: EventEmitter<string> = new EventEmitter<string>();
  loginhtml: string;
  inputKey: string;		//On page <input> value
  entireGigObject: Gig;
  http: Http;

  modalActionsLogin = new EventEmitter<string|MaterializeAction>();
  modalActionsLogout = new EventEmitter<string|MaterializeAction>();
  modalActionsMore = new EventEmitter<string|MaterializeAction>();
  modalActionsMoreNotLoggedIn = new EventEmitter<string|MaterializeAction>();
  modalActionsMoreLoggedInNotArtist = new EventEmitter<string|MaterializeAction>();
  modalActionsMoreLoggedInArtist = new EventEmitter<string|MaterializeAction>();

  userAuthToken = null;
  userDisplayName = "empty";
  auth2: any;
  user: User = new User();
  document: any;
  googleLoginButtonId = "gapiLogin";
  recievedArtist: string[];


  //By defining gigService as public, it makes the service accessible within the class (within AppLoginComponent).
  constructor(private winRef: WindowRef,http: Http, public userService: userService, public gigService: gigService, private _zone: NgZone) {
    console.log("Constructor");
    this.document = winRef.nativeWindow.document;
    this.http = http;
    this.recievedArtist = [];
    userService.setUser(this.user);
    console.log("end of constructor");
  }

  ngOnInit() {
    this.renderSignInButton();
    //This will run the joinEvent function via the page's button upon the enter key being pressed. Needs tested on mobile.
    this.document.getElementById('gigInput').onkeypress = (e) => {
        if (e.keyCode==13) {
          this.document.getElementById('enterGig').click();
        }
      }
  }

  // Converts the Google login button stub to an actual button.
  public renderSignInButton() {
    console.log("renderSignInButton");
    gapi.signin2.render(
      this.googleLoginButtonId,
      {
        'scope': 'profile email',
        'width': 123,
        'height': 39,
        'longtitle': false,
        'theme' : "dark",
        'onsuccess': this.onGoogleLoginSuccess,
        'onfailure': this.onFailure
      });
  }

  // Triggered after a user successfully logs in using the Google external
  // login provider.
  onGoogleLoginSuccess = (loggedInUser) => {
    console.log("onGoogleLoginSuccess");
    this._zone.run(() => {
        console.log("_zone.run() in onGoogleLoginSuccess")
        var profile = loggedInUser.getBasicProfile();
        //this.userAuthToken = loggedInUser.getAuthResponse().id_token;
        //this.userDisplayName = loggedInUser.getBasicProfile().getName();
        this.createGoogleUser(profile);
    });
  }

  // process after signin failure
  public onFailure = (error) => {
      console.log(error);
  }

  ngAfterContentInit() {
    console.log("ngAfterContentInit");
    setTimeout( () =>  {
      this.start();
    }, 500);
  }

  start() {
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.getAuthInstance();
      this.attachSignin(document.getElementById('gapiLogin'));
    });
  };

  public attachSignin(element) {
    console.log("attachSignin");
    console.log(element.id);
    console.log(this.auth2)
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        this._zone.run(() => {
          var profile = googleUser.getBasicProfile();
          this.createGoogleUser(profile);
        });
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
    });
  }

  public createGoogleUser(profile) {
    console.log("createGoogleUser");
    this.userDisplayName = profile.getName();
    this.userService.setUser(this.user);
    this.user.setName(profile.getName());
    this.user.setEmail(profile.getEmail());
    this.user.setId(profile.getId());
    this.user.setLoggedIn(true);
    this.user.setVip(false);
    this.user.setType("google");
    this.checkArtist();
    console.log(this.user);
  }

  public checkArtist() {
    console.log("in check artist");
    // set up parameters for post to find memberships
		// that the user has already.
		// this is in the constructor so it happens when the page is loaded
		var uploadObj = {
		key: this.user.getEmail()
		};
		// Initialize parameters for URL
		let params: URLSearchParams = new URLSearchParams();
		// Saves key/value pairs to URL query string
		for (let key in uploadObj) {
		  params.set(key, uploadObj[key]);
		}
		// Create the headers for the page
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');
		// Places parameters in query string
		let options = new RequestOptions({
		  search: params,
		  headers: pageHeaders
		});
		// This conversion to a JSON string allows Go to parse the request body
		let body = JSON.stringify(this.user.getEmail());
		// The post request which takes parameters of address, body, options
		this.http.post('/findmem', body, options)
		.map((res) => res.json())
		.subscribe((res) => this.waitForHttp(res));
  }

  private waitForHttp(res: any) {
    this.recievedArtist = res || [];
    if(this.recievedArtist.length === 0) {
      console.log('Empty Array');
      this.user.setArtist(false);
    } else {
      console.log("Non Empty Array");
      console.log(this.recievedArtist);
      this.user.setArtist(true);
    }
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit")
  }

  public openModal1() {
    if (this.user.getLoggedIn() == true) {
      this.modalActionsLogout.emit({action:"modal",params:['open'],});
    }
    else {
      this.modalActionsLogin.emit({action:"modal",params:['open'],});
    }
  }
  public openModal2() {
    if (this.user.getLoggedIn() == true) {
      if(this.user.isArtist() == true) {
        this.modalActionsMoreLoggedInArtist.emit({action:"modal",params:['open'],});
      }
      else {
        this.modalActionsMoreLoggedInNotArtist.emit({action:"modal",params:['open'],})
      }
    }
    else {
      this.modalActionsMoreNotLoggedIn.emit({action:"modal",params:['open'],});
    }
  }
  public closeModal1() {
    this.modalActionsLogin.emit({action:"modal",params:['close'],});
    this.modalActionsLogout.emit({action:"modal",params:['close'],});
  }
  public closeModal2() {
    this.modalActionsMoreNotLoggedIn.emit({action:"modal",params:['close']});
    this.modalActionsMoreLoggedInNotArtist.emit({action:"modal",params:['close']});
    this.modalActionsMoreLoggedInArtist.emit({action:"modal",params:['close']});
  }

  public joinEvent(location: string) {
    // The input from the html page is checked to ensure it's not empty
    console.log("[DEBUG] input key:", this.inputKey)
    if (typeof(this.inputKey) === "undefined") {
      console.log("Key not defined, Breaking");
      return
    }
    // Stores value from input element
    var uploadObj = {
      key: this.inputKey
    };
    // Initialize parameters for URL
    let params: URLSearchParams = new URLSearchParams();
    // Saves key/value pairs to URL query string
    for (let key in uploadObj) {
      params.set(key, uploadObj[key]);
    }
    // Create the headers for the page
    var pageHeaders = new Headers();
    pageHeaders.append('Content-Type', 'application/json');
    // Places parameters in query string
    let options = new RequestOptions({
      search: params,
      headers: pageHeaders
    });
    // This conversion to a JSON string allows Go to parse the request body
    let body = JSON.stringify(this.inputKey);
    // The post request which takes parameters of address, body, options
    this.http.post('/gigcode', body, options)
      .map((res) => res.json())
      .catch(this.errorHandler)
      .subscribe(data => this.entireGigObject = data);
    // Takes gigService and saves the returned object to it.
    // Since JS executes asynchronously, we timeout to let the server response come in and set the gigService value.
    // By placing gigService in the parameters, I'm telling Angular to inject the service here for use.=
    setTimeout(() => {
      console.log("[DEBUG] Gig object:", this.entireGigObject);
      this.gigService.setGig(this.entireGigObject);
      if(typeof(this.entireGigObject) !== 'undefined') {
        this.notify.emit(location);
      }
      else{
        console.log('Bad Gig ID given');
        document.getElementById("inputErrorMessage").style.visibility="visible";
      }
    }, 750);
  }

  private errorHandler(error: Response | any) {
    var errorMessage;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errorMessage = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errorMessage = error.message ? error.message : error.toString();
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }

  public signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      console.log('User signed out.');
    });
    this.user.setLoggedIn(false);
  }

  public emit_event(location: string) {
    this.notify.emit(location);
  }
}
