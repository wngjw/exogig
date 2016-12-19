import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'request',
	templateUrl: 'html/request_html.html',
	outputs: ['notify']
})

export class AppRequestComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	question: string;
	request: string;
	constructor() {
	}

	public submitRequest(){
		console.log(this.question);
		console.log(this.request);

	}
	public emit_event(location:string) {
		this.notify.emit(location);
	}

}

