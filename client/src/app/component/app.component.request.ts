/**
* request.ts
* Description: Webpage that handles front end song request functionality
* Author: Spencer Ballo
* Date Modified: 3 February 2017
*/

import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Request, Song} from '../gig/app.gig.gig';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';
import { gigService } from '../services/app.service.gig';
import { Gig, SetList } from '../gig/app.gig.gig';

@Component({
 	selector: 'request',
	templateUrl: '../html/request_html.html',
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

/**
* Creates the component on the page for a song request.
*/
export class AppRequestComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	question: string;
	request: string;
	currentUser: User = new User();
	http: Http;
 	receivedSong: Request;
  requestedSong: Request = new Request("NA", 1, this.gigId);
  prevRequestedSong: Request;
	loggedInSymbol: string;
	topOption: string;
	gigObject: Gig;
  gigSetList: SetList;
  gigId: string;
	showLabels = false;

	constructor(http: Http, userService: userService, gigService: gigService) {
		this.http = http;
		this.currentUser = userService.getUser();
		this.check_login(userService);
		this.gigObject = gigService.getGig();
		this.gigSetList = this.gigObject.GigSetList;
    this.gigId = this.gigObject.GigId;
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

	public submitRequest() {    // Stores value from input element
    // Create the headers for the page
    var pageHeaders = new Headers();
    pageHeaders.append('Content-Type', 'application/json');

    // Places parameters in query string
    let options = new RequestOptions({
      headers: pageHeaders
    });

    this.requestedSong.TimesRequested = 1;
    this.requestedSong.GigId = this.gigId;

    let requestedSongBody = JSON.stringify(this.requestedSong);

    let previousSongBody = JSON.stringify(this.prevRequestedSong);

    if (this.prevRequestedSong == null) {
      this.prevRequestedSong = new Request("NO_PREV_REQUEST", 0, this.gigId);
    }

    console.log("prevsongname: ", this.prevRequestedSong.Name, "reqsongname: ", this.requestedSong.Name);

    if (this.prevRequestedSong.Name === this.requestedSong.Name) {
      document.getElementById("requestErrorMessage").style.visibility="visible";
      document.getElementById("requestReceivedMessage").style.visibility="hidden";
      console.log("[TO BE IMPLEMENTED]: <Displaying toast>");
    } else {
      this.http.post('/request', requestedSongBody, options)
      .map((res) => res.json())
      .subscribe(data => this.prevRequestedSong = data);
      console.log("[DEBUG] Sent song request:", requestedSongBody);
      document.getElementById("requestErrorMessage").style.visibility="hidden";
      document.getElementById("requestReceivedMessage").style.visibility="visible";
      //this.prevRequestedSong.RequestedSongName = this.requestedSong.RequestedSongName;
      console.log("[DEBUG] Previous requested song: ", this.prevRequestedSong);
    }

  }

	public emit_event(location:string) {
		this.notify.emit(location);
	}
}
