import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate  } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize';
import { User, Artist, Membership } from '../gig/app.gig.users';
import { userService } from '../services/app.service.user';
import { artistService } from '../services/app.service.artist';

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
	newBio: string;
	newGenre: string;
	oldGenre: string;
	showLabels = false;
	http: Http;
	user: User;
	loggedInSymbol: string;
	topOption: string;
	artist:Artist = new Artist;
	members:string[];
	artistService: artistService;
	newMembership:Membership = new Membership();
	memEmail:string;

	constructor(http: Http, artistService:artistService) {
		this.http = http;
		
		this.artist = artistService.getArtist();
		console.log(this.artist);
		this.newBio = this.artist.Bio || "Enter new Bio here";
		this.oldGenre = this.artist.Genre;
		this.artistService=artistService;
		this.newMembership.setArtist(this.artist.Name);
		this.retrieveMems();
		
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

	private retrieveMems(){
		var uploadObj = {
			key: this.artist.Name
		};
		// Initialize parameters for URL
		let params = new URLSearchParams();
		// Create the headers for the page
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');
		// Places parameters in query string
		let options = new RequestOptions({
			search: params,
			headers: pageHeaders
		});
		// This conversion to a JSON string allows Go to parse the request body
   		let body = JSON.stringify(this.artist.Name);
   		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		this.http.post('/findmeminband', body, options)
		.map((res) => res.json())
		.subscribe((res) => this.waitForHttp(res));
	}
	private waitForHttp(res:any){
		
		if (res !== undefined) {
			this.members = res as string[];
     		 console.log("there are members");
    }
		this.emit_event('editbio');
  }
	

	public changeBio(){
		this.artist.setBio(this.newBio);
		this.artist.setGenre(this.newGenre);
		// Stores value from input element
		var uploadObj = {
			key: this.artist
		};
		// Initialize parameters for URL
		let params = new URLSearchParams();
  		params.append('bio', this.newBio);
  		params.append('genre', this.newGenre);
		// Create the headers for the page
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');
		// Places parameters in query string
		let options = new RequestOptions({
			search: params,
			headers: pageHeaders
		});
		// This conversion to a JSON string allows Go to parse the request body
   		let body = JSON.stringify(this.artist);
   		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		this.http.post('/editbio', body, options)
		.map((res) => res.json())
		.subscribe(data => this.artist = data);
		this.artistService.setArtist(this.artist);
		this.notify.emit('bandpage');
	}
	public addMem(){
		this.newMembership.Email=this.memEmail;
		this.members.push(this.newMembership.Email);
		this.newMembership.Artist=this.artist.Name;
		var uploadObj = {
			key: this.newMembership
		};
		// Initialize parameters for URL
		let params = new URLSearchParams();
		// Create the headers for the page
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');
		// Places parameters in query string
		let options = new RequestOptions({
			search: params,
			headers: pageHeaders
		});
		// This conversion to a JSON string allows Go to parse the request body
   		let body = JSON.stringify(this.newMembership);
   		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		this.http.post('/addmem', body, options)
		.map((res) => res.json())
		.subscribe((res) => this.waitForNewMem(res));
		
		
	}
	private waitForNewMem(res:any){
		
		if (res !== undefined) {
			this.newMembership = new Membership();
     		console.log("new mem added");
			this.retrieveMems();
			this.memEmail = null;
    }
	else{
		console.log("it's all good");
	}
		this.emit_event('editbio');
  }

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}
	
	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
