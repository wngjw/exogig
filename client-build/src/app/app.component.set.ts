/**
* request.ts
* Description: Webpage that displays the song lists of songs being played at a Gig.
* Author: Spencer Ballo
* Date Modified: 21 January 2017
*/

import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

interface Set {
	songlist: SongList;
}

interface Song {
  name: string;
  rating: number;
}

interface SongList {
  listname: string;
  songs: Song[];
}

@Component({
 	selector: 'set',
	templateUrl: 'html/set_html.html',
	outputs: ['notify']
})

export class AppSetComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	http: Http;
    receivedSet: Set;

	//I assume this is ran on initializing the page.
	//While loading, consider using a material design loading circle.
	constructor(http: Http) {
		this.http = http;
		this.requestSet();
	}

	public checkValue() {
		console.log(this.receivedSet);
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}

	private requestSet() {
		this.http.get('/2').map(res => res.json()).subscribe(data => this.receivedSet = data);
	}

}

