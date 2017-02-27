/**
* login.ts
* Description: Handles logging in, or joining a Gig.
* Author: Spencer Ballo, Bethany Bosenberger, Luke Johnson
* Date Modified: 16 February 2017
*/

import { Input, Output, Component, Directive, Injectable, EventEmitter, NgZone } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize';
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { gigService } from '../services/app.service.gig';
import { Gig } from '../gig/app.gig.gig';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';

declare var gapi: any;
declare var FB: any;


@Component({
 	selector: 'login-page',
  templateUrl: '../html/login_html.html',
  outputs: ['notify'],
  providers: [FacebookService]
})

export class AppLoginComponent {
  notify: EventEmitter<string> = new EventEmitter<string>();
  loginhtml: string;
  inputKey: string;		//On page <input> value
  entireGigObject: Gig;
  http: Http;

  modalActions1 = new EventEmitter<string|MaterializeAction>();
  modalActions2 = new EventEmitter<string|MaterializeAction>();

  userAuthToken = null;
  userDisplayName = "empty";
  auth2: any;
  user: User = new User();
  googleLoginButtonId = "gapiLogin";


  //By defining gigService as public, it makes the service accessible within the class (within AppLoginComponent).
  constructor(http: Http, public userService: userService, public gigService: gigService, private _zone: NgZone, private fb: FacebookService) {
    document.getElementById('gigInput').onkeypress=function(e){
    if(e.keyCode==13){
        document.getElementById('enterGig').click();
    }

    }
    console.log("Constructor");
    this.http = http;
    userService.setUser(this.user);
    let fbParams: FacebookInitParams = {
      appId: '1866232750300614',
      xfbml: true,
      version: 'v2.8',
    };
    this.fb.init(fbParams);
    console.log("end of constructor");
  }

  ngOnInit() {
    this.renderSignInButton();
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
        this.userAuthToken = loggedInUser.getAuthResponse().id_token;
        this.userDisplayName = loggedInUser.getBasicProfile().getName();
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
          this.userDisplayName = profile.getName();
          this.userService.setUser(this.user);
          this.user.setName(profile.getName());
          this.user.setEmail(profile.getEmail());
          this.user.setId(profile.getId());
          this.user.setLoggedIn(true);
          this.user.setVip(false);
          this.user.setType("google");
          console.log(this.user);
        });
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
    });
  }


  ngAfterViewInit() {
    console.log("ngAfterViewInit")
  }

  public openModal1() {
    this.modalActions1.emit({action:"modal",params:['open'],});
  }
  public openModal2() {
    this.modalActions2.emit({action:"modal",params:['open'],});
  }
  public closeModal1() {
    this.modalActions1.emit({action:"modal",params:['close']});
  }
  public closeModal2() {
    this.modalActions2.emit({action:"modal",params:['close']});
  }

  /*public getSigninStatus() {
    var signedIn : boolean;
    if(this.auth2.getAuthInstance().isSignedIn.get() & FB.getLoginStatus())
    return signedIn;
  }*/

  public createUserObject() {
    console.log("createUserObject");
    if (gapi.auth2.isSignedIn.get()) {
      var profile = gapi.auth2.currentUser.get().getBasicProfile();
      this.user.setName(profile.getName());
      this.user.setEmail(profile.getEmail());
      this.user.setId(profile.getId());
      this.user.setLoggedIn(true);
      this.user.setVip(false);
      this.user.setType("google");
    }
    else if (this.fb.getLoginStatus()) {
      FB.api('/me','GET',{"fields":"name,email"},function(response) {
        this.user.setName(response.name);
        this.user.setEmail(response.email);
        this.user.setId(response.id);
      });
      this.user.setLoggedIn(true);
      this.user.setVip(false);
      this.user.setType("facebook");
    }
    console.log(this.user);
  }

  public facebookLogin() {
    console.log("facebookLogin");
    FB.login().then(
      (response: FacebookLoginResponse) => {
        console.log(response);
      },
      (error: any) => console.error(error),
    );
  }

  public joinEvent(location: string) {
    // The input from the html page
    console.log("[DEBUG] input key:", this.inputKey)

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
    console.log("[DEBUG] body:", body);

    // The post request which takes parameters of address, body, options
    this.http.post('/kendrick', body, options)
      .map((res) => res.json())
      .subscribe(data => this.entireGigObject = data);

    // Takes gigService and saves the returned object to it.
    // Since JS executes asynchronously, we timeout to let the server response come in and set the gigService value.
    // By placing gigService in the parameters, I'm telling Angular to inject the service here for use.

    setTimeout(() => {
      console.log("[DEBUG] Gig object:", this.entireGigObject);
      this.gigService.setGig(this.entireGigObject);
      this.notify.emit(location);
    }, 1000);
  }

  public signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      console.log('User signed out.');
    });
  }

  public emit_event(location: string) {
    this.notify.emit(location);
  }
}
