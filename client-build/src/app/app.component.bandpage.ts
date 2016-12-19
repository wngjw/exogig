import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'band-page',
	templateUrl: 'html/band_page_html.html',
	outputs: ['notify']
})

export class AppBandPageComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();

	constructor() {
	}


	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
