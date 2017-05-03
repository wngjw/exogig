/**
* request.ts
* Description: Handles landing in to the app.
* Author: Spencer Ballo
* Date Modified: 16 February 2017
*/

import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { gigService } from '../services/app.service.gig';

@Component({
 	selector: 'main-page',
	templateUrl: '../html/main_page_html.html',
	outputs: ['notify'],
})

export class AppMainComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	quickie: string;
	gigName: string;
 	gigLocation: string;

	constructor(public gigService: gigService) {
		this.gigName = gigService.getGig().GigName;
    	this.gigLocation = gigService.getGig().GigLocation;
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}


}
