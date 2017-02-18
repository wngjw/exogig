<<<<<<< HEAD
/**
* request.ts
* Description: Handles logging in, or joining a Gig.
* Author: Spencer Ballo, Bethany Bosenberger, Luke Johnson
* Date Modified: 16 February 2017
*/

import { Input, Output, Component, Directive, Injectable, EventEmitter, NgZone } from '@angular/core';
=======
import { Input, Output, Component, Directive, Injectable, EventEmitter } from '@angular/core';
>>>>>>> 6218fecc742cf6ec8dfafadf86f0edeed1bcbd37
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize';
import { GoogleAPILoader } from './gapi/app.gapi.gapiloader';
import { gigService } from './services/app.service.gig';
import { Gig } from './gig/app.gig.gig';
import { userService } from './services/app.service.user';
import { User } from './gig/app.gig.users';

@Component({
 	selector: 'login-page',
	templateUrl: 'html/login_html.html',
	outputs: ['notify'],
})

export class AppLoginComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
  loginhtml: string;
	inputKey: string;		//On page <input> value
	entireGigObject: Gig;
  promise = GoogleAPILoader.load();
	http: Http;

	modalActions = new EventEmitter<string|MaterializeAction>();
	userAuthToken = null;
  userDisplayName = "empty";
	auth2: any;
	user: User = new User();

  public openModal() {
    	this.modalActions.emit({action:"modal",params:['open']});
  }
  public closeModal() {
    	this.modalActions.emit({action:"modal",params:['close']});
  }

<<<<<<< HEAD
	//By defining gigService as public, it makes the service accessible within the class (within AppLoginComponent).
	constructor(http: Http,public userService: userService,public gigService: gigService, private _zone: NgZone) {
=======
	constructor(http: Http) {
>>>>>>> 6218fecc742cf6ec8dfafadf86f0edeed1bcbd37
		this.http = http;
		setTimeout( () => {
			this.start();
		},1000);
	}


	public joinEvent(location:string) {
		console.log("[DEBUG] input key:",this.inputKey)

    // Stores value from input element
		var uploadObj = {
			key: this.inputKey
		};

    // Initialize parameters for URL
    let params: URLSearchParams = new URLSearchParams();

    // Saves key/value pairs to URL query string
		for(let key in uploadObj) {
			params.set(key, uploadObj[key]);
		}
<<<<<<< HEAD

		//May not need this below.
		var headers = new Headers();
		headers.append('Content-Type','application/json');
=======
>>>>>>> 6218fecc742cf6ec8dfafadf86f0edeed1bcbd37

    // Not using for now
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type','application/json');

    // Places parameters in query string
		let options = new RequestOptions({
			search: params,
      headers: pageHeaders
		});
<<<<<<< HEAD
		this.http.get('/kendrick', options).map(res => res.json()).subscribe(data => this.entireGigObject = data);
=======

    let body = JSON.stringify(this.inputKey);
    console.log("[DEBUG] body:", body);

    this.http.post('/kendrick', body, options)
      .map((res) => res.json())
      .subscribe(data => this.entireGigObject = data);

    // Old http get
		/*this.http.get('/kendrick', options)
    .map(res => res.json())
    .subscribe(data => this.entireGigObject = data);*/

		//Takes gigService and saves the returned object to it.
>>>>>>> 6218fecc742cf6ec8dfafadf86f0edeed1bcbd37
		//Since JS executes asynchronously, we timeout to let the server response come in and set the gigService value.
		//By placing gigService in the parameters, I'm telling Angular to inject the service here for use.
		setTimeout((gigService: gigService) => {
			console.log(this.entireGigObject);
			gigService.setGig(this.entireGigObject);
			this.notify.emit(location);
		},1000);
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
        },(error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

  public signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
<<<<<<< HEAD
=======

	public emit_event(location:string) {
		this.notify.emit(location);
	}
>>>>>>> 6218fecc742cf6ec8dfafadf86f0edeed1bcbd37
}
