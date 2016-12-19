import { Input, Output, Component, Directive, Injectable,EventEmitter } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize'

@Component({
 	selector: 'login-page',
	templateUrl: 'html/login_html.html',
	outputs: ['notify'],
})

export class AppLoginComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();

	modalActions = new EventEmitter<string|MaterializeAction>();
  	openModal() {
    	this.modalActions.emit({action:"modal",params:['open']});
  	}
  	closeModal() {
    	this.modalActions.emit({action:"modal",params:['close']});
  	}




	loginhtml: string;
	constructor() {
	}


	public emit_event(location:string) {
		this.notify.emit(location);
	}
}

