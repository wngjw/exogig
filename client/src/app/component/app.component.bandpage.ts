import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { userService } from '../services/app.service.user';
import { artistService } from '../services/app.service.artist';
import { User, Artist } from '../gig/app.gig.users';
import { Gig } from '../gig/app.gig.gig';
import { Observable } from 'rxjs';

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
	currentArtist: Artist = new Artist();
	artistService: artistService;
	artistName: string;
	eventname: string;
 	date: string;
 	location: string;
 	time: string;
	gigNamePlace:string;
	DateOfGigPlace:string;
	TimeOfGigPlace:string;
	gigs: Gig[];
	LocationOfGigPlace:string;
	editIndex:number;

	loggedInSymbol: string;
	topOption: string;		//Shouldn't need.
	showLabels = false;
	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];
	http:Http;
	newGig: Gig = new Gig();

	constructor(http: Http, userService: userService, artistService: artistService) {
		this.http = http;
		this.currentUser = userService.getUser();
    this.artistService = artistService;
		this.currentArtist = artistService.getArtist();
		this.artistName = this.currentArtist.getName();
		this.gigs = this.currentArtist.getGigs();
		this.buttonLabels = ['Home','Options','Info','Songs','Sets'];
    this.buttonIcon = ['home','local_play','assignments','info_outline','search',];
    this.pageEmitters = ['login','bandoptions','editbio','songlist','setlist'];
		this.gigNamePlace = "Gig Name";
		this.DateOfGigPlace = "Date of the Gig";
		this.TimeOfGigPlace = "Time of the Gig";
		this.LocationOfGigPlace = "Location of the Gig";
		this.editIndex = null;
		console.log(this.gigs);
	}

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}
	public edit_gig(index:number){
		this.editIndex = index;
    console.log(typeof this.currentArtist);
		var gigToEdit = this.currentArtist.getGigs();
		this.newGig = gigToEdit[index];
		this.DateOfGigPlace = gigToEdit[index].GigDate;
		this.gigNamePlace = gigToEdit[index].GigName;
		this.TimeOfGigPlace = gigToEdit[index].GigTime;
		this.LocationOfGigPlace = gigToEdit[index].GigLocation;
  }

	private catchError(error: Response) {
		var errorMes = "This shit is fucked";
		return Observable.throw(errorMes);
	}

	public createGig(){
		console.log(this.newGig);
		var gen = true;

		// The post request which takes parameters of address, body, options
		console.log(gen, "before get call");

		if(this.editIndex != null){
			this.currentArtist.gigs[this.editIndex]=this.newGig;
			gen = false;
		}
		else{
      console.log(this.currentArtist); ////TODO
			this.currentArtist.addGig(this.newGig);
		}
		if(gen === true){
			console.log('in generate func');
			this.http.get('/generate')
			.map((res) => res.json())
			.catch(this.catchError)
			.subscribe(data => this.newGig.GigId = data);
		}

		this.artistService.setArtist(this.currentArtist);
		console.log(this.newGig.GigId);
		//set parameters for post to push a new membership
		var uploadObj = {
		key: this.currentArtist
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
		console.log(this.currentArtist);
		// This conversion to a JSON string allows Go to parse the request body
		let body = JSON.stringify(this.currentArtist);
		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		this.http.post('/addgig', body, options)
		.map((res) => res.json())
		.subscribe((res) => this.waitForHttp(res));
	}


	private waitForHttp(res: any) {
    if (res !== undefined) {
      this.currentArtist = res as Artist;
    }
    console.log(this.currentArtist.getGigs());
		this.artistService.setArtist(this.currentArtist);
		this.newGig=new Gig();
		this.gigNamePlace = "Gig Name";
		this.DateOfGigPlace = "Date of the Gig";
		this.TimeOfGigPlace = "Time of the Gig";
		this.LocationOfGigPlace = "Location of the Gig";
		this.emit_event('bandpage');
  }

}
