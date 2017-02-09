import { Input, Output, Component, Directive, Injectable, EventEmitter } from '@angular/core';
import { Headers, Http } from '@angular/http';
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
	inputKey: string;		//On page value
  promise = GoogleAPILoader.load();

	modalActions = new EventEmitter<string|MaterializeAction>();
  	openModal() {
    	this.modalActions.emit({action:"modal",params:['open']});
  	}
  	closeModal() {
    	this.modalActions.emit({action:"modal",params:['close']});
  	}

	constructor() {
	}


	public joinEvent(location:string) {
		console.log(this.inputKey) 
	
	
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
