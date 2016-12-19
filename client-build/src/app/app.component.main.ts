import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

@Component({
 	selector: 'main-page',
	templateUrl: 'html/main_page_html.html',
	outputs: ['notify'],
})

export class AppMainComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	quickie: string;
	gigName: string;

	constructor(public http_obj: Http) {
		this.gigName = 'Aerosmith';
	}


	public emit_event(location:string) {
		this.notify.emit(location);
	}

	public server_request() {
		this.http_obj.get('checkme').subscribe((res:Response) => this.quickie = res.toString());
		console.log(this.quickie);
	}
}

