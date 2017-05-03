import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';
import { Observable } from "rxjs/Observable";
@Component({
 	selector: 'notifications',
	templateUrl: '../html/notifications_html.html',
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

export class AppNotificationsComponent {
	http: Http;
	notify: EventEmitter<string> = new EventEmitter<string>();
	song: string;
	topOption: string;	//Shouldn't need.
	showLabels = false;
	user: User = new User();
	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];
	notificationText: string;

	constructor(http: Http, userService:userService) {
		this.http = http;
		this.user = userService.getUser();
		if(this.user.getLoggedIn() && this.user.isArtist()){
			this.buttonLabels = ['Home','Notifications','Browse','Options', 'New Band'];
    		this.buttonIcon = ['home','info_outline','search','local_play', 'library_add'];
    		this.pageEmitters = ['login','notifications','bandviewer','bandoptions', 'createband'];
		}
		else{
			if(this.user.getLoggedIn() && !this.user.isArtist()){
				this.buttonLabels = ['Home','Notifications','Browse', 'New Band'];
	    		this.buttonIcon = ['home','info_outline','search','library_add'];
	    		this.pageEmitters = ['login','notifications','bandviewer', 'createband'];	
			}
			else{
				this.buttonLabels = ['Home','Notifications','Browse'];
	    		this.buttonIcon = ['home','info_outline','search'];
	    		this.pageEmitters = ['login','notifications','bandviewer'];
			}
		}
		this.loadText();
	}

	public loadText() {
		this.http.get('/notifications')
				.map((res) => res.json())
				.catch(this.catchError)
				.subscribe((data) => this.pushData(data));

	}

	public pushData(data: any) {
		if (data != null) {
			this.notificationText = data;
		}
	}

	private catchError(error: Response) {
		var errorMes = "This shit is mucked";
		return Observable.throw(errorMes);
	}
	
	public emit_event(location:string) {
		this.notify.emit(location);
	}

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}

	public swap_view() {
		this.emit_event('loginhome')
	}


}
