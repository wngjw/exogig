import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'bandoptions',
	templateUrl: '../html/band_options_html.html',
	outputs: ['notify'],
	animations: [
		//Animation handling for nav labels.
    	trigger('labelstate', [
   			transition('void => *', [		//Starting styles on enter.
      			style({fontSize: '0px',height: '5px',width: '5px',marginTop: '40px',marginRight: '15px', opacity: '0'}),
      			animate(400)
    		]),
			transition('* => void', [		//Goal styles on exit.
      			animate(400, style({fontSize: '0px',height: '5px',width: '5px',marginTop: '40px',marginRight: '15px',opacity: '0'}))
    		])
  		])
	]
})

export class AppBandOptionsComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	rate: string;
	newBandName: string;
	newBandMembers: string;
	topOption: string;
	showLabels = false;


	constructor() {
	}

	public submitRate(){
		console.log(this.rate);
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}

	public swap_view() {
		this.emit_event('loginhome')
	}

	//All of the band information pertaining to a user will need to be downloaded upon loading this page.
	//This will just pass the select band information onto 
	public enter_band_view(band: string) {
		console.log("Going into " + band + "'s band instance");
		this.emit_event('bandpage');
	}
}
