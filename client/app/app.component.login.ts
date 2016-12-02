import { Input, Output, Component, Directive, Injectable,EventEmitter } from '@angular/core';
import { Headers, Http } from '@angular/http';


@Component({
 	selector: 'login-page',
	templateUrl: 'html/login_html.html',
	outputs: ['notify']
})

export class AppLoginComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();

	loginhtml: string;
	constructor() {
	}


	public emit_event_to_mainpage() {
		this.notify.emit('Click from nested component1');
	}
}

