import { Input, Output, Component, Directive, Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize';
import { GoogleAPILoader } from './gapi/app.gapi.gapiloader'

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

	constructor(http: Http) {
		this.http = http;
	}


	public joinEvent(location:string) {
		console.log(this.inputKey)
		var uploadObj = {
			key: this.inputKey
		};

		console.log(JSON.stringify(uploadObj))

		var headers = new Headers();
		headers.append('Content-Type','application/json');

		let options = new RequestOptions({
			headers: headers,
			body: JSON.stringify(uploadObj)
		});

		this.http.get('/kendrick', options).map(res => res.json()).subscribe(data => this.entireGigObject = data);

		if(!typeof(this.entireGigObject) === undefined)
		{
			console.log("Recieved Gig!");
			console.log(this.entireGigObject);
		}
			console.log(this.entireGigObject);

		this.notify.emit(location);
	}

  private onSuccess(googleUser) {
      console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    }


  private onFailure(error) {
      console.log(error);
    }

  public renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.onSuccess(gapi.auth2.getAuthInstance()),
      'onfailure': this.onFailure("No data received")
      });
      this.closeModal();
  }

  public signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

	public emit_event(location:string) {
		this.notify.emit(location);
	}
}
