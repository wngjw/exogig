import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'create-setlist',
	templateUrl: '../html/make_set_list_html.html',
	outputs: ['notify']
})

export class AppCreateSetlistComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	setlist: string;

	constructor() {
	}

	//this functon will be used to push to the server
	public saveSetlist(){
		console.log(this.setlist);
	}
	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
