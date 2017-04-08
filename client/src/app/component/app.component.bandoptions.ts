import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { Membership, User, Artist } from '../gig/app.gig.users';
import { userService } from '../services/app.service.user';
import { artistService } from '../services/app.service.artist';

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
	recievedArtist: string[];
	currentSelectedIndex: number;
	topOption: string;
	showLabels = false;
	http: Http;
	user: User = new User();
	userEmail: string;

	art: Artist = new Artist();
	artistService: artistService;

	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];

	constructor(http: Http, userService: userService, artistService:artistService) {
		this.http = http;
		this.user = userService.getUser();
		this.currentSelectedIndex = 0;
		this.userEmail = this.user.getEmail();
		this.recievedArtist = [];
		this.artistService = artistService;
		this.buttonLabels = ['Home','Notifications','Browse','Options', 'New Band'];
    this.buttonIcon = ['home','info_outline','search','local_play', 'library_add'];
    this.pageEmitters = ['login','notifications','bandviewer','bandoptions', 'createband'];

		// set up parameters for post to find memberships
		// that the user has already.
		// this is in the constructor so it happens when the page is loaded
		var uploadObj = {
		key: this.userEmail
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
		let body = JSON.stringify(this.userEmail);
		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		console.log("call post to find memberships");
		this.http.post('/findmem', body, options)
		.map((res) => res.json())
		.subscribe((data) => this.recieveArtist(data));
	}

  public recieveArtist(data: any) {
    console.log(typeof this);
    this.recievedArtist = data || [];
    console.log(this.recievedArtist);
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
	public enter_band_view(index: number) {
		var artistname = this.recievedArtist[index];
		// Stores value from input element
		var uploadObj = {
		key: artistname
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
		let body = JSON.stringify(this.recievedArtist[index]);
		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		console.log("call post to find artist");
		this.http.post('/getartist', body, options)
		  .map((res) => res.json())
  		.subscribe((data) => this.waitForHttp(data));
	}

	private waitForHttp(data: Artist) {
		if (data !== undefined) {
			console.log("There is an artist");
			this.art = data as Artist;
      this.art = Object.setPrototypeOf(this.art, Artist.prototype)
      console.log("After reassignment:" + this.art.getName());
			this.artistService.setArtist(this.art);
    }
		this.emit_event('bandpage');
  }
}
