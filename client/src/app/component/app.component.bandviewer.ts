import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'band-viewer',
	templateUrl: '../html/band_page_html_viewer.html',
	outputs: ['notify']
})

export class AppBandViewerComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();

	constructor() {
	}


	public emit_event(location:string) {
		this.notify.emit(location);
	}

	public swap_view() {
		this.emit_event('bandpage')
	}
}
