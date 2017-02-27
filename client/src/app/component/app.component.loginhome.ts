import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers } from '@angular/http';
import { gigService } from '../services/app.service.gig';


@Component({
 	selector: 'loginhome',
	templateUrl: '../html/login_home_html.html',
	outputs: ['notify']
})

export class AppCreateLoginHomeComponent {
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
