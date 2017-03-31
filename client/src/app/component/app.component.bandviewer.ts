import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { userService } from '../services/app.service.user';
import { User } from '../gig/app.gig.users';

@Component({
 	selector: 'band-viewer',
	templateUrl: '../html/band_page_html_viewer.html',
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

export class AppBandViewerComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	topOption: string;
	showLabels = false;
	user: User = new User();
	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];
	


	constructor(userService: userService) {
		this.user = userService.getUser();
		this.checkArtist()
	}

	checkArtist(){
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
