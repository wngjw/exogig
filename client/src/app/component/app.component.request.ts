/**
* request.ts
* Description: Webpage that handles front end song request functionality
* Author: Spencer Ballo
* Date Modified: 16 January 2017
*/

import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Song, SongList } from '../gig/app.gig.gig';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';

@Component({
 	selector: 'request',
	templateUrl: '../html/request_html.html',
	outputs: ['notify']
})

/**
* Creates the component on the page for a song request.
*/
export class AppRequestComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	question: string;
	request: string;
	currentUser: User = new User();
	http: Http;
 	receivedSongList: SongList;
	loggedInSymbol: string;


	constructor(http: Http,userService: userService) {
    this.http = http;
		this.currentUser = userService.getUser();
		this.check_login(userService);
	}

	private check_login(userService: userService) {
		if (userService.getUser().getLoggedIn() == true) {
			this.loggedInSymbol = "swap_horiz";
		}
		else {
			this.loggedInSymbol = "person_add";
		}
	}

	private swap_view() {
		//If logged in, swap to not at Gig view.
		if(this.currentUser.getLoggedIn() == true) {
			this.emit_event('bandviewer')
		}
		//If not logged in, popup the login option.
		else {
			//Insert popup trigger here. (The popup should have the leave Gig option as well)
			this.emit_event('login');
		}
	}

	public submitRequest() {
    this.http.get('/2').map(res => res.json()).subscribe(data => this.receivedSongList = data);
    console.log(this.receivedSongList);   // Receiving the test song from the page
		console.log(this.question);
		console.log(this.request);
  }

	public emit_event(location:string) {
		this.notify.emit(location);
	}
}
