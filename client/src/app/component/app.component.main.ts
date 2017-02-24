/**
* request.ts
* Description: Handles landing in to the app.
* Author: Spencer Ballo
* Date Modified: 16 February 2017
*/

import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { gigService } from '../services/app.service.gig';
import { Gig, SetList } from '../gig/app.gig.gig';

@Component({
 	selector: 'main-page',
	templateUrl: '../html/main_page_html.html',
	outputs: ['notify'],
})

export class AppMainComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	quickie: string;
	gigName: string;
	gigObject: Gig;
  gigSetList: SetList;

	constructor(public http_obj: Http, public gigService: gigService) {
		this.gigName = gigService.getGig().GigName;
    this.gigObject = gigService.getGig();
    this.gigSetList = this.gigObject.GigSetList;
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}

	public server_request() {
		this.http_obj.get('checkme').subscribe((res:Response) => this.quickie = res.toString());
		console.log("[DEBUG]:", this.quickie);
	}
}
