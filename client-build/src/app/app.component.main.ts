/**
* request.ts
* Description: Handles landing in to the app.
* Author: Spencer Ballo
* Date Modified: 16 February 2017
*/

import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { gigService } from './services/app.service.gig';

@Component({
 	selector: 'main-page',
	templateUrl: 'html/main_page_html.html',
	outputs: ['notify'],
})

export class AppMainComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	quickie: string;
	gigName: string;

	//gigObject: Gig;		//I create this object so we can look at the gig object from gigService. SHOULD BE USELESS.

	constructor(public http_obj: Http, public gigService: gigService) {
		this.gigName = gigService.getGig().GigName;
	}
		
	public emit_event(location:string) {
		this.notify.emit(location);
	}

	public server_request() {
		this.http_obj.get('checkme').subscribe((res:Response) => this.quickie = res.toString());
		console.log(this.quickie);
	}
}

