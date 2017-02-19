import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'bandoptions',
	templateUrl: '../html/band_options_html.html',
	outputs: ['notify']
})

export class AppBandOptionsComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	rate: string;
	newBandName: string;
	newBandMembers: string;


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

	//All of the band information pertaining to a user will need to be downloaded upon loading this page.
	//This will just pass the select band information onto 
	public enter_band_view(band: string) {
		console.log("Going into " + band + "'s band instance");
	}
}
