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

	gigObject: Object;

	constructor(public http_obj: Http, gigService: gigService) {
		this.gigName = 'Aerosmith';
		console.log("Does it save?");
		this.gigObject = gigService.getGig();
		console.log(gigService.getGig());
		console.log(this.gigObject);
	}
		


	public emit_event(location:string) {
		console.log(this.gigObject);
		this.notify.emit(location);
	}

	public server_request() {
		this.http_obj.get('checkme').subscribe((res:Response) => this.quickie = res.toString());
		console.log(this.quickie);
	}
}

