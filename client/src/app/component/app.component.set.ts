/**
* request.ts
* Description: Webpage that displays the song lists of songs being played at a Gig.
* Author: Spencer Ballo
* Date Modified: 16 February 2017
*/

import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { gigService } from '../services/app.service.gig';
import { Gig } from '../gig/app.gig.gig';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';

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
	templateUrl: '../html/set_html.html',
	outputs: ['notify']
})

export class AppSetComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	http: Http;
    receivedSet: Set;
	currentSelectedIndex: number;
	currentSelectedList: number;
	currentUser: User = new User();
	gigObject: Gig;	 //I define this object so we can later store the gig object and edit it.
	loggedInSymbol: string;


	//I assume this is ran on initializing the page.
	//While loading, consider using a material design loading circle.
	constructor(http: Http, public gigService: gigService,userService: userService) {
		this.http = http;
		this.gigObject = gigService.getGig();

		this.currentSelectedList = 0;
		this.currentSelectedIndex = 0;

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
			this.emit_event('loginhome')
		}
		//If not logged in, popup the login option.
		else {
			//Insert popup trigger here. (The popup should have the leave Gig option as well)
			this.emit_event('login');
		}
	}

	//This will check if a given index (song), has been selected. If so it'll give the selected look.
	public checkSelected(index: number,listNum: number):boolean {
		if(this.currentSelectedIndex == index && this.currentSelectedList == listNum)
			return true;
		else {
			return false;
		}
	}

	//This will fire on click, setting whatever song has been selected to the currentSelectedIndex; Same for currentSelectedList
	// If it's already been selected, it will toggle it to unselected.
	public setSelected(index: number,listNum: number) {
		if(index == this.currentSelectedIndex) {
			this.currentSelectedIndex = 0;
		}
		else {
			this.currentSelectedIndex = index;
		}
		if(listNum == this.currentSelectedList) {
			this.currentSelectedList = 0;
		}
		else {
			this.currentSelectedList = listNum;
		}
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
