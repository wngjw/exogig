import { Component, Directive, Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
 	selector: 'chat',
	templateUrl: '../html/chat_html.html',
	outputs: ['notify']
})

export class AppChatComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();

	constructor() {
	}


	public emit_event(location:string) {
		this.notify.emit(location);
	}

}
