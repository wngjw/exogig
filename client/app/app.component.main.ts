import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'main-page',
	templateUrl: 'html/main_page_html.html',
	outputs: ['notify']
})

export class AppMainComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();

	constructor() {
	}


	public emit_event_to_bands() {
		this.notify.emit('Click from nested component2');
	}

}

