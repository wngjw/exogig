import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'edit-songlist',
	templateUrl: 'html/edit_song_list_html.html',
	outputs: ['notify']
})

export class AppSongListComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();

	constructor() {
	}


	public emit_event(location:string) {
		this.notify.emit(location);
	}

}

