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

    let params: URLSearchParams = new URLSearchParams();

		for(let key in uploadObj) {
			params.set(key, uploadObj[key]);
		}
		//console.log(JSON.stringify(uploadObj))

		var headers = new Headers();
		headers.append('Content-Type','application/json');

		let options = new RequestOptions({
			search: params
		});

		this.http.get('/kendrick', options).map(res => res.json()).subscribe(data => this.entireGigObject = data);

		//This will be undefined since it runs asynchronously. BUT if you press the button again, it'll be populated.
		console.log(this.entireGigObject);

		//Currently I'm commenting this out since the Gig object is kept in scope of this one page only.
		//We'll need to provide access to this object through either an Angular2 service, or passing it through the emit function below.
		//If you need to test other pages just uncomment this.notify.emit below, BUT as of 2/10 the Gig object will not
		//be in scope on the other pages until the above is created and implemented.
		
		//this.notify.emit(location);
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
