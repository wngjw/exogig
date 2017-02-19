/**
* login.ts
* Description: Handles logging in, or joining a Gig.
* Author: Spencer Ballo, Bethany Bosenberger, Luke Johnson
* Date Modified: 16 February 2017
*/

import { Input, Output, Component, Directive, Injectable, EventEmitter, NgZone } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize';
import { GoogleAPILoader } from '../gapi/app.gapi.gapiloader';
import { FacebookService, FacebookLoginResponse, FacebookInitParams } from 'ng2-facebook-sdk';
import { gigService } from '../services/app.service.gig';
import { Gig } from '../gig/app.gig.gig';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';

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
  promise = GoogleAPILoader.load();
  //something = FBConnector.constructor('1866232750300614');
  http: Http;

  modalActions1 = new EventEmitter<string|MaterializeAction>();
  modalActions2 = new EventEmitter<string|MaterializeAction>();

  userAuthToken = null;
  userDisplayName = "empty";
  auth2: any;
  user: User = new User();

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

  public facebookLogin() {
    this.fb.login().then(
      (response: FacebookLoginResponse) => console.log(response),
      (error: any) => console.error(error)
    );
  }

  //By defining gigService as public, it makes the service accessible within the class (within AppLoginComponent).
  constructor(http: Http, public userService: userService, public gigService: gigService, private _zone: NgZone, private fb: FacebookService) {
    this.http = http;
    userService.setUser(this.user);
    setTimeout(() => {
      this.start();		//Needs to wait for the DOM to be fully loaded.
    }, 1000);
    let fbParams: FacebookInitParams = {
      appId: '1866232750300614',
      xfbml: true,
      version: 'v2.8',
    };
    this.fb.init(fbParams);
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

  start() {
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.getAuthInstance();
      this.attachSignin(document.getElementById('gapiLogin'));
    });
  };

  public attachSignin(element) {
    console.log(element.id);
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        this._zone.run(() => {
          this.userAuthToken = googleUser.getAuthResponse().id_token;
          this.userDisplayName = googleUser.getBasicProfile().getName();
          console.log("Login Complete: ");
          console.log(this.userAuthToken);
          console.log(this.userDisplayName);
          this.user.setLoggedIn(true);
          this.user.setValidation(this.userAuthToken);
          this.userService.setUser(this.user);
        });
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
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
