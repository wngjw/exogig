import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'edit-bio',
	templateUrl: 'html/edit_bio_html.html',
	outputs: ['notify']
})

export class AppEditBioComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	bio: string
	constructor() {
		this.bio;
	}

	public changeBio(){
		console.log(this.bio)
	}
	public emit_event(location:string) {
		this.notify.emit(location);
	}

}

