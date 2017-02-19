import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'create-event',
	templateUrl: '../html/create_event_html.html',
	outputs: ['notify']
})

export class AppCreateEventComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	createeventhtml: string;
 	eventname: string;
 	date: string;
 	location: string;
 	time: string;
 	notes: string;

	constructor() {
		this.eventname;
 		this.date;
 		this.location;
 		this.time;
 		this.notes;
	}

	public changeEvent() {
     	console.log(this.eventname)
 		console.log(this.date)
 		console.log(this.location)
 		console.log(this.time)
 		console.log(this.notes)

   	}
	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
