import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';

@Component({
 	selector: 'band-page',
	templateUrl: '../html/band_page_html.html',
	outputs: ['notify']
})

export class AppBandPageComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	currentUser: User = new User();
	loggedInSymbol: string;

	constructor(userService: userService) {
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

	//This function will do different things depending on if you're logged in or not.
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



		public emit_event(location:string) {
		this.notify.emit(location);
	}

}

