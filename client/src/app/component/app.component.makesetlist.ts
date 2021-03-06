import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate, NgModule } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { artistService } from '../services/app.service.artist';
import { Artist } from '../gig/app.gig.users';
import { Song, Set, SetList } from '../gig/app.gig.gig';
import { Ng2DragDropModule } from "ng2-drag-drop";


@Component({
	selector: 'create-setlist',
	templateUrl: '../html/make_set_list_html.html',
	outputs: ['notify'],
	animations: [
		//Animation handling for nav labels.
		trigger('labelstate', [
			transition('void => *', [		//Starting styles on enter.
				style({ fontSize: '0px', height: '5px', width: '5px', marginTop: '40px', marginRight: '15px', opacity: '0' }),
				animate(400)
			]),
			transition('* => void', [		//Goal styles on exit.
				animate(400, style({ fontSize: '0px', height: '5px', width: '5px', marginTop: '40px', marginRight: '15px', opacity: '0' }))
			])
		])
	]
})

export class AppCreateSetlistComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	setlist: string;
	showLabels = false;
	currentArtist: Artist = new Artist();
	http: Http;
	welcome: string;
	newSet: Set = new Set();
	songlist: Song[];
	newSongs: Song[];
	newSetList: any[];
	numberSets: number;
	pushSetList: SetList = new SetList();
	editIndex: number;
	status: string;



	constructor(http: Http, public artistService: artistService) {
		this.currentArtist = artistService.getArtist();
		if (this.currentArtist.Songlist != null) {
			this.welcome = "Drag and drop songs for your set";
			this.status = "viewsetlists"
		}
		else {
			this.welcome = "please add songs to your song list";
			this.status = "redirect"
		}
		this.songlist = this.currentArtist.Songlist;
		this.http = http;
		this.editIndex = null;
	}

	// this function allows specific setlists to be edited
	// 		without adding it to the list of setlists again
	public edit_set_list(index: number) {
		// set the correct index to edit
		this.editIndex = index;
		var setToEdit = this.currentArtist.Setlists;
		// update the vatiable on the list being edited
		this.pushSetList.SetListName = setToEdit[index].SetListName;
		this.pushSetList.SetsInSetList = setToEdit[index].SetsInSetList;
		this.numberSets = setToEdit[index].SetsInSetList.length;
		this.status = "editsetlist"
	}

	// this function allows new setlists to be created
	public NewSet() {
		this.numberSets = null;
		this.pushSetList = new SetList();
		this.notify.emit('setlist');
	}

	public createNewSet() {
		this.numberSets = this.numberSets + 1;
		this.pushSetList.addSet(new Set());
	}

	public createNewSetList() {
		this.numberSets = 0;
		this.pushSetList = new SetList();
		this.status = "editsetlist"
	}

	// this function deletes a setlist from the artists lists of setlists
	public delete(index: number) {
		this.currentArtist.Setlists.splice(this.editIndex, 1);
		this.artistService.setArtist(this.currentArtist);
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
		this.http.post('/addsetlist', body, options)
			.map((res) => res.json())
			.subscribe((res) => this.waitForHttp(res));

	}
	// this function allows the user to enter a number for how
	// 		many sets they want in their setlist
	public enterNum() {
		var i = 1;
		this.pushSetList = new SetList();
		//this.pushSetList.setsInSetList = new Set[this.numberSets];
		while (i <= this.numberSets) {
			var set = new Set();
			this.pushSetList.addSet(set);
			console.log(this.pushSetList);
			i++;
		}
		this.notify.emit('setlist');
	}
	// this function enables the drag and drop functionallity
	public addToSet(song: any, n: number) {
		if (this.pushSetList.SetsInSetList[n].SongsInSet === undefined) {
			this.pushSetList.SetsInSetList[n] = new Set();
			console.log(this.pushSetList.SetsInSetList[n]);
			this.pushSetList.SetsInSetList[n].SongsInSet = [song.dragData as Song];
		}
		else {
			this.pushSetList.SetsInSetList[n].SongsInSet.splice(this.pushSetList.SetsInSetList[n as number].SongsInSet.length, 0, song.dragData as Song);
		}
		console.log(n);
		//this.newSongs = this.newSet.songsInSet;
		console.log(song);
		this.notify.emit('setlist');

	}
	//this functon will be used to push to the server
	public save() {

		if (this.currentArtist.Setlists === undefined) {
			this.currentArtist.Setlists = [this.pushSetList];
		}
		else {
			if (this.editIndex != null) {
				this.currentArtist.Setlists[this.editIndex].SetListName = this.pushSetList.SetListName;
				this.currentArtist.Setlists[this.editIndex].SetsInSetList = this.pushSetList.SetsInSetList;
			}
			else {
				this.currentArtist.Setlists.push(this.pushSetList);
			}
		}
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
		this.http.post('/addsetlist', body, options)
			.map((res) => res.json())
			.subscribe((res) => this.waitForHttp(res));

	}
	public waitForHttp(res: any) {
		this.currentArtist = res as Artist;
		this.artistService.setArtist(this.currentArtist);
	}

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}

	public emit_event(location: string) {
		this.notify.emit(location);
	}

}
