import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate  } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize';
import { User } from '../gig/app.gig.users';
import { userService } from '../services/app.service.user';

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
	bio: string;
	genre: string;
	showLabels = false;
	http: Http;
	user: User;
	loggedInSymbol: string;
	topOption: string;

	constructor(http: Http) {
		this.bio;
		this.http = http;
		this.genre;
	}
	private check_login(userService: userService) {
		if (userService.getUser().getLoggedIn() == true) {
			this.loggedInSymbol = "home";
			this.topOption = "Home";
		}
		else {
			this.loggedInSymbol = "close";
			this.topOption = "Exit";
		}
	}


	public changeBio(){
		// Stores value from input element
		var uploadObj = {
			key: this.bio
		};

		// Initialize parameters for URL
		let params = new URLSearchParams();
  		params.append('bio', this.bio);
  		params.append('genre', this.genre);
	
		// Create the headers for the page
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');

		// Places parameters in query string
		let options = new RequestOptions({
			search: params,
			headers: pageHeaders
		});
		// This conversion to a JSON string allows Go to parse the request body
   		let body = JSON.stringify(this.bio);
   		console.log("[DEBUG] body:", body);
		console.log(this.bio);
		console.log(this.genre);
		  // The post request which takes parameters of address, body, options
		this.http.post('/kendrick', body, options)
		.map((res) => res.json())
		.subscribe(data => this.user = data);

		this.notify.emit('bandpage');
	}

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}
	
	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
