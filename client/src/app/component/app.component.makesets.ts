import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'create-sets',
	templateUrl: '../html/make_sets_html.html',
	outputs: ['notify']
})

export class AppCreateSetsComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();

	constructor() {
	}


	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
