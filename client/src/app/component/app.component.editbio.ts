import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate  } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'edit-bio',
	templateUrl: '../html/edit_bio_html.html',
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

export class AppEditBioComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	bio: string
	showLabels = false;

	constructor() {
		this.bio;
	}

	public changeBio(){
		console.log(this.bio)
	}

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}
	
	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
