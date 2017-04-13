import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions,Response  } from '@angular/http';
import { userService } from '../services/app.service.user';
import { artistService } from '../services/app.service.artist';
import { User, Artist } from '../gig/app.gig.users';
import { Observable } from 'rxjs';

@Component({
 	selector: 'band-viewer',
	templateUrl: '../html/band_page_html_viewer.html',
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

export class AppBandViewerComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	topOption: string;
	showLabels = false;
	user: User = new User();
	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];
	artistList: string[];
	http:Http;
	viewArtist:Artist;
	


	constructor(userService: userService, http:Http,public artistService: artistService) {
		this.http = http;
		console.log("constructor");
		this.user = userService.getUser();
		console.log("before check artist");
		this.checkArtist();
		this.artistList = [];
		console.log("before get all artist");
		this.getAllArtist();
		
	}

	checkArtist(){
		console.log("in check artist");
		if(!this.user.getLoggedIn()){
			this.buttonLabels = ['Home','Notifications','Browse'];
			this.buttonIcon = ['home','info_outline','search'];
			this.pageEmitters = ['login','notifications','bandviewer'];
		}
		else if(this.user.getLoggedIn() && !this.user.isArtist()){
			this.buttonLabels = ['Home','Notifications','Browse','New Band'];
			this.buttonIcon = ['home','info_outline','search','library_add'];
			this.pageEmitters = ['login','notifications','bandviewer','createband'];
		}
		else{
			this.buttonLabels = ['Home','Notifications','Browse','New Band','Options'];
			this.buttonIcon = ['home','info_outline','search','library_add','local_play'];
			this.pageEmitters = ['login','notifications','bandviewer','createband','bandoptions'];
		}
		console.log("end of check artist");
	}
	

	public emit_event(location:string) {
		this.notify.emit(location);
	}
	private catchError(error: Response) {
		var errorMes = "This shit is fucked";
		return Observable.throw(errorMes);
	}
	public getAllArtist(){
		console.log("in get all artist");
		console.log(this.artistList);
		this.http.get('/getallartists')
			.map(res => res.json())
			.catch(this.catchError)
			.subscribe(res => this.waitForHttp(res));
		console.log("end of get all artist");
	}
	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}
	public enter_band_view(index:number){
		var uploadObj = {
		key: this.artistList[index]
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
		let body = JSON.stringify(this.artistList[index]);
		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		console.log("call post to find artist");
		this.http.post('/getartist', body, options)
		  .map((res) => res.json())
  		.subscribe((data) => this.waitForHttpArt(data));

	}
	private waitForHttpArt(data: Artist) {
		if (data !== undefined) {
			console.log("There is an artist");
			this.viewArtist = data as Artist;
     		this.viewArtist = Object.setPrototypeOf(this.viewArtist, Artist.prototype)
      		console.log("After reassignment:" + this.viewArtist.getName());
			this.artistService.setArtist(this.viewArtist);
   		 }
		this.emit_event('createevent');//to view the bad selected
  }
	private waitForHttp(data: any) {
		console.log("in wait for http");
		if (data !== undefined) {
			console.log("There are artist");
			this.artistList = data as string[];
      		
      		console.log(this.artistList);
    	}
		console.log("end of wait for http");
  	}

}
