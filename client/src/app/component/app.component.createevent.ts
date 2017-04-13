import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { userService } from '../services/app.service.user';
import { artistService } from '../services/app.service.artist';
import { User, Artist } from '../gig/app.gig.users';
import { Gig } from '../gig/app.gig.gig';

@Component({
 	selector: 'create-event',
	templateUrl: '../html/create_event_html.html',
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

export class AppCreateEventComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	user: User = new User();
	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];
	artistList: string[];
	http:Http;
	viewArtist:Artist = new Artist();
	showLabels = false;
	gigs: Gig[];
	bio:string;
	name:string;
	genre:string;


	constructor(http:Http,public userService:userService,public artistService:artistService) {
		this.http = http;
		console.log("constructor");
		this.user = userService.getUser();
		this.viewArtist = artistService.getArtist();
		console.log("before check artist");
		this.checkArtist();
		this.gigs = this.viewArtist.getGigs();
		this.bio = this.viewArtist.getBio();
		this.name = this.viewArtist.getName();
		this.genre = this.viewArtist.getGenre();


	}
	checkArtist(){
		console.log("in check artist");
		if(!this.user.getLoggedIn()){
			this.buttonLabels = ['Home','Notifications','Browse'];
			this.buttonIcon = ['home','info_outline','search'];
			this.pageEmitters = ['login','notifications','bandviewer'];
		}
		else if(this.user.getLoggedIn() && !this.user.isArtist()){
			this.buttonLabels = ['Home','Notifications','Browse','New Band'];
			this.buttonIcon = ['home','info_outline','search','library_add'];
			this.pageEmitters = ['login','notifications','bandviewer','createband'];
		}
		else{
			this.buttonLabels = ['Home','Notifications','Browse','New Band','Options'];
			this.buttonIcon = ['home','info_outline','search','library_add','local_play'];
			this.pageEmitters = ['login','notifications','bandviewer','createband','bandoptions'];
		}
		console.log("end of check artist");
	}

	

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
