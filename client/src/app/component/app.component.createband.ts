import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { Membership, User, Artist } from '../gig/app.gig.users';
import { userService } from '../services/app.service.user';
import { artistService } from '../services/app.service.artist';

@Component({
 	selector: 'create-band',
	templateUrl: '../html/create_band_html.html',
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

export class AppCreateBandComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();



	topOption: string;
	showLabels = false;
	member: Membership = new Membership();
	membership: Membership;
    artist: Artist;
	http: Http;
	user: User = new User();
	userEmail: string;
	// needed to create a band
    newArtist: string;
    newGenre: string;
    newBio: string;
    // used to enter into that band's page
	art: Artist = new Artist();
	artistService: artistService;
	// for nav
	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];

	constructor(http: Http, userService: userService, artistService:artistService) {
		this.http = http;
		this.user = userService.getUser();
		this.userEmail = this.user.getEmail();
		this.artistService=artistService;
		this.checkArtist();
		
	}
	checkArtist(){
		if(this.user.isArtist()){
			this.buttonLabels = ['Home','Notifications','Browse','Options'];
			this.buttonIcon = ['home','info_outline','search','local_play'];
			this.pageEmitters = ['login','notifications','bandviewer','bandoptions'];
		}
		else{
			this.buttonLabels = ['Home','Notifications','Browse'];
			this.buttonIcon = ['home','info_outline','search'];
			this.pageEmitters = ['login','notifications','bandviewer'];
		}
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
	public enter_band_view(index: number) {
		// Stores value from input element
		this.member.setArtist(this.newArtist);
		this.member.setEmail(this.userEmail);
		this.art.setName(this.newArtist);
        this.art.setBio(this.newBio);
        this.art.setGenre(this.newGenre);
		this.artistService.setArtist(this.art);
		//set parameters for post to push a new membership
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
        var uploadObj = {
		key: this.member
         };
    
	    //set parameters for post to push a new artist
		var uploadObj2 = {
		key: this.art
		};
		
		// Saves key/value pairs to URL query string
		for (let key in uploadObj2) {
		params.set(key, uploadObj2[key]);
		}
		// Create the headers for the page
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');
		// Places parameters in query string
		options = new RequestOptions({
		search: params,
		headers: pageHeaders
		});
		// This conversion to a JSON string allows Go to parse the request body
	    body = JSON.stringify(this.art);
		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		this.http.post('/addartist', body, options)
		.map((res) => res.json())
		.subscribe(data => this.artist = data);
		//console.log("Going into " + this.recievedArtist[index] + "'s band instance");
		this.emit_event('bandpage');
	}
}