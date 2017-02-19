import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'rate',
	templateUrl: '../html/rate_html.html',
	outputs: ['notify']
})

export class AppRateComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	rate:string;
	constructor() {
	}

	public submitRate(){
		console.log(this.rate);
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
