import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { Membership, User, Artist } from '../gig/app.gig.users';
import { userService } from '../services/app.service.user';

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
	recievedArtist: Artist;
	currentSelectedIndex: number;
	topOption: string;
	showLabels = false;
	member: Membership = new Membership();
	membership: Membership;
	http: Http;
	user: User = new User();
	newArtist: string;
	newUser: string;

	constructor(http: Http, userService: userService) {
		this.http = http;
		this.user = userService.getUser();
		this.currentSelectedIndex = 0;
		this.http.get('/findmem').map(res => res.json()).subscribe(data => this.recievedArtist = data);
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
	//This will check if a given index (artist/band), has been selected. If so it'll give the selected look.
	public checkSelected(index: number,listNum: number):boolean {
		if(this.currentSelectedIndex == index)
			return true;
		else {
			return false;
		}
	}
	//All of the band information pertaining to a user will need to be downloaded upon loading this page.
	//This will just pass the select band information onto 
	public enter_band_view(band: string) {
		// Stores value from input element
		this.member.setArtist(this.newArtist);
		this.member.setUser(this.newUser);
		var uploadObj = {
		key: this.member
		};

		// Initialize parameters for URL
		let params: URLSearchParams = new URLSearchParams();

		// Saves key/value pairs to URL query string
		for (let key in uploadObj) {
		params.set(key, uploadObj[key]);
		}

		// Create the headers for the page
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');

		// Places parameters in query string
		let options = new RequestOptions({
		search: params,
		headers: pageHeaders
		});

		// This conversion to a JSON string allows Go to parse the request body
		let body = JSON.stringify(this.member);
		console.log("[DEBUG] body:", body);

		// The post request which takes parameters of address, body, options
		this.http.post('/addmem', body, options)
		.map((res) => res.json())
		.subscribe(data => this.membership = data);

		console.log("Going into " + band + "'s band instance");
		this.emit_event('bandpage');
	}
}

