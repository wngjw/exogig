import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { userService } from '../services/app.service.user';
import { artistService } from '../services/app.service.artist';
import { User, Artist } from '../gig/app.gig.users';
import { Gig, SetList } from '../gig/app.gig.gig';
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
	setlist:SetList[];

	loggedInSymbol: string;
	topOption: string;		//Shouldn't need.
	showLabels = false;
	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];
	http:Http;
	newGig: Gig = new Gig();
	selectedSetList:string;

	constructor(http: Http, userService: userService, artistService: artistService) {
		this.http = http;
		this.currentUser = userService.getUser();
    	this.artistService = artistService;
		this.currentArtist = artistService.getArtist();
		this.artistName = this.currentArtist.Name;
		this.gigs = this.currentArtist.Gigs;
		this.buttonLabels = ['Home','Options','Info','Songs','Sets'];
    	this.buttonIcon = ['home','local_play','assignments','info_outline','search',];
    	this.pageEmitters = ['login','bandoptions','editbio','songlist','setlist'];
		this.gigNamePlace = "Gig Name";
		this.DateOfGigPlace = "Date of the Gig";
		this.TimeOfGigPlace = "Time of the Gig";
		this.LocationOfGigPlace = "Location of the Gig";
		this.editIndex = null;
		this.setlist = this.currentArtist.Setlists;
		this.selectedSetList = "No set list has been selected";
		console.log(this.gigs);
	}
	public addSetToGig(n:number){
		console.log("in add set to gig");
		this.newGig.GigSetList = this.setlist[n];
		this.selectedSetList = this.setlist[n].SetListName;
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
		
		var gigToEdit = this.currentArtist.Gigs;
		
		this.newGig.GigName = gigToEdit[index].GigName;
		this.newGig.GigDate = gigToEdit[index].GigDate;
		this.newGig.GigTime = gigToEdit[index].GigTime;
		this.newGig.GigLocation = gigToEdit[index].GigLocation;
		this.newGig.GigSetList = gigToEdit[index].GigSetList;
		this.selectedSetList = this.newGig.GigSetList.SetListName;
  }

	private catchError(error: Response) {
		var errorMes = "This shit is fucked";
		return Observable.throw(errorMes);
	}

	public NewGig() {
		console.log("Adding Gig");
		this.newGig.GigName = "";
		this.newGig.GigDate = "";
		this.newGig.GigTime = "";
		this.newGig.GigLocation = "";
		this.editIndex = null;
	}

	public enterGig() {
		// TODO!!!!!

		console.log("Entering Gig");
	}

	public deleteGig() {
		if(this.editIndex != null){
			this.currentArtist.Gigs.splice(this.editIndex,1);
			this.NewGig()
		}
		else{
			this.NewGig()
		}
		console.log("Deleting Gig");
		this.save();
		this.NewGig();

		this.gigs = this.currentArtist.Gigs;
	}

	public createGig(){

		console.log(this.newGig);
		var gen = true;

		// The post request which takes parameters of address, body, options
		console.log(gen, "before get call");

		if(this.editIndex != null){
			this.currentArtist.Gigs[this.editIndex].GigName = this.newGig.GigName;
			this.currentArtist.Gigs[this.editIndex].GigLocation = this.newGig.GigLocation;
			this.currentArtist.Gigs[this.editIndex].GigDate = this.newGig.GigDate;
			this.currentArtist.Gigs[this.editIndex].GigTime = this.newGig.GigTime;

			gen = false;
		}
		else{
      		console.log(this.currentArtist); ////TODO
			this.currentArtist.addGig(this.newGig);
			this.newGig = new Gig();
		}
		if(gen === true){
			console.log('in generate func');
			this.http.get('/generate')
				.map((res) => res.json())
				.catch(this.catchError)
				.subscribe(data => this.newGig.GigId = data);
			console.log(this.newGig.GigId);
		}
		this.save();
	}
	public save(){
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
    //console.log(this.currentArtist.getGigs());
		this.artistService.setArtist(this.currentArtist);
		this.newGig=new Gig();
		this.gigNamePlace = "Gig Name";
		this.DateOfGigPlace = "Date of the Gig";
		this.TimeOfGigPlace = "Time of the Gig";
		this.LocationOfGigPlace = "Location of the Gig";
		this.emit_event('bandpage');
  }

}
