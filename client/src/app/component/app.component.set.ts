/**
* request.ts
* Description: Webpage that displays the song lists of songs being played at a Gig.
* Author: Spencer Ballo
* Date Modified: 16 February 2017
*/

import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate  } from '@angular/core';
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

export class AppSetComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	http: Http;
    receivedSet: Set;
	currentSelectedIndex: number;
	currentSelectedList: number;
	currentUser: User = new User();
	gigObject: Gig;	 //I define this object so we can later store the gig object and edit it.
	loggedInSymbol: string;
	topOption: string;
	showLabels = false;


	//I assume this is ran on initializing the page.
	//While loading, consider using a material design loading circle.
	constructor(http: Http, public gigService: gigService,userService: userService) {
		this.http = http;
		this.gigObject = gigService.getGig();
		Object.setPrototypeOf(this.gigObject, Gig);

		this.currentSelectedList = 0;
		this.currentSelectedIndex = 0;

		this.currentUser = userService.getUser();
		this.check_login(userService);
		console.log(this.gigObject);
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

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
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
