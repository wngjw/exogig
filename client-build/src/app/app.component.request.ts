/**
* request.ts
* Description: Webpage that handles front end song request functionality
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
  listName: string;
  songs: Song[];
}

@Component({
 	selector: 'request',
	templateUrl: 'html/request_html.html',
	outputs: ['notify']
})

/**
* Creates the component on the page for a song request.
*/
export class AppRequestComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	question: string;
	request: string;
  http: Http;
  receivedSet: Set;
	constructor(http: Http) {
    this.http = http;
	}

/**
* Submits a request to the page on click.
*/

/*	This code is required to upload a JavaScript Object.

	for(let key in data) {
			params.set(key, data[key]);
		}
	let options = new RequestOptions({
			search: params
		});
		return this._http.get(service, options)
		.map(...)
		.catch(...)
		.finally(() => {
			//do something
		});

*/

	public submitRequest() {
    this.http.get('/2').map(res => res.json()).subscribe(data => this.receivedSet = data);
    console.log(this.receivedSet);   // Receiving the test song from the page
		console.log(this.question);
		console.log(this.request);
  }

	public emit_event(location:string) {
		this.notify.emit(location);
	}
}
