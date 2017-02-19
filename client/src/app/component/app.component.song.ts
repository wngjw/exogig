import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'song',
	templateUrl: '../html/song_html.html',
	outputs: ['notify']
})

export class AppSongComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	song: string;
	constructor() {
		this.song;
	}

	public createSong(){
		console.log(this.song);
	}
	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
