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
  	openModal() {
    	this.modalActions.emit({action:"modal",params:['open']});
  	}
  	closeModal() {
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

		let params = new URLSearchParams;

		for(let key in uploadObj) {						//This key is like the key in a dictionary. It represents the object's names for each value (each value being the actual reference of the dictionary's key)
			params.set(key, uploadObj[key]);
		}
		let options = new RequestOptions({
			search: params
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
