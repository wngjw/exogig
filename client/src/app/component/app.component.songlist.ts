import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate  } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { artistService } from '../services/app.service.artist';
import { Artist } from '../gig/app.gig.users';
import { Song } from '../gig/app.gig.gig';
@Component({
 	selector: 'edit-songlist',
	templateUrl: '../html/edit_song_list_html.html',
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

export class AppSongListComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	showLabels = false;
	newSong:string;
	addedSong:Song = new Song();
	artistService:artistService;
	currentArtist: Artist = new Artist();
	songlist:Song[];
	http:Http;

	constructor(artistService:artistService,http:Http) {
		this.artistService = artistService;
		this.currentArtist = this.artistService.getArtist();
		console.log("in constructor");
		console.log(this.currentArtist);
		console.log(this.currentArtist.getSonglist());
		console.log(typeof this.currentArtist.Songlist);
		this.songlist = this.currentArtist.Songlist as Song[];
		if(this.currentArtist.Songlist === undefined)
		{	
			console.log(this.currentArtist.Songlist);
			this.songlist=[];
		}
		else
		{	
			console.log(this.songlist);
			this.songlist = this.currentArtist.getSonglist() as Song[];
		}
		this.http = http;
	}
	public delete(index:number){
		this.songlist.splice(index,1);
		this.currentArtist.Songlist=this.songlist;
		this.artistService.setArtist(this.currentArtist);

	}
	public addSong(){
		console.log("in add song");
		this.addedSong.Name=this.newSong;
		if(this.songlist.length === null){
			this.songlist.push(this.addedSong);
		}
		else{
			this.songlist.splice(this.songlist.length,0,this.addedSong);
		}
		this.currentArtist.Songlist = this.songlist;
		this.artistService.setArtist(this.currentArtist);
		this.newSong = null;
		this.addedSong = new Song();
		this.notify.emit('songlist');
	}
	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}
	public save(){
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
		// This conversion to a JSON string allows Go to parse the request body
		let body = JSON.stringify(this.currentArtist);
		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		this.http.post('/updatesonglist', body, options)
		.map((res) => res.json())
		.subscribe(data => this.currentArtist = data);
		console.log(this.currentArtist.Songlist);
	}

	public emit_event(location:string) {
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
		// This conversion to a JSON string allows Go to parse the request body
		let body = JSON.stringify(this.currentArtist);
		console.log("[DEBUG] body:", body);
		// The post request which takes parameters of address, body, options
		this.http.post('/updatesonglist', body, options)
		.map((res) => res.json())
		.subscribe(data => this.currentArtist = data);
		console.log(this.currentArtist.Songlist);
		this.notify.emit(location);
	}

}
