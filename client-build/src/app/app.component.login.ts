/**
* request.ts
* Description: Handles logging in, or joining a Gig.
* Author: Spencer Ballo, Bethany Bosenberger, Luke Johnson
* Date Modified: 16 February 2017
*/

import { Input, Output, Component, Directive, Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize';
import { GoogleAPILoader } from './gapi/app.gapi.gapiloader';
import { gigService } from './services/app.service.gig';


@Component({
 	selector: 'login-page',
	templateUrl: 'html/login_html.html',
	outputs: ['notify'],
})

export class AppLoginComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
  loginhtml: string;
	inputKey: string;		//On page <input> value
	entireGigObject: Object;
  promise = GoogleAPILoader.load();
	http: Http;
	modalActions = new EventEmitter<string|MaterializeAction>();

  public openModal() {
    	this.modalActions.emit({action:"modal",params:['open']});
  }
  public closeModal() {
    	this.modalActions.emit({action:"modal",params:['close']});
  }

	//By defining gigService as public, it makes the service accessible within the class (within AppLoginComponent).
	constructor(http: Http,public gigService: gigService) {
		this.http = http;
	}

	public joinEvent(location:string) {
		var uploadObj = {
			key: this.inputKey
		};

    let params: URLSearchParams = new URLSearchParams();

		for(let key in uploadObj) {
			params.set(key, uploadObj[key]);
		}
		
		//May not need this below.
		var headers = new Headers();
		headers.append('Content-Type','application/json');

		let options = new RequestOptions({
			search: params
		});

		this.http.get('/kendrick', options).map(res => res.json()).subscribe(data => this.entireGigObject = data);

		//Since JS executes asynchronously, we timeout to let the server response come in and set the gigService value.
		//By placing gigService in the parameters, I'm telling Angular to inject the service here for use.
		setTimeout(() => {
			console.log(this.entireGigObject);
			this.gigService.setGig(this.entireGigObject);		//Takes gigService and saves the returned object to it so we can use it in other components.
			this.notify.emit(location);
		},1000);
	}

  public signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

}
