import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'bandoptions',
	templateUrl: '../html/band_options_html.html',
	outputs: ['notify']
})

export class AppBandOptionsComponent {
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

	public swap_view() {
		this.emit_event('bandpage')
	}


}
