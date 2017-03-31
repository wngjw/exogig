import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';

@Component({
 	selector: 'band-page',
	templateUrl: '../html/band_page_html.html',
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

export class AppBandPageComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	currentUser: User = new User();
	loggedInSymbol: string;
	topOption: string;		//Shouldn't need.
	showLabels = false;
	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];

	constructor(userService: userService) {
		this.currentUser = userService.getUser();
		this.buttonLabels = ['Home','Options','Info','Songs','Sets'];
        this.buttonIcon = ['home','local_play','assignments','info_outline','search',];
        this.pageEmitters = ['login','bandoptions','editbio','songlist','setlist'];
	}

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}

}

