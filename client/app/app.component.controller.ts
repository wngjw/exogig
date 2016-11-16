import { Component, Directive, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';


@Component({
 	selector: 'controller-page',
	templateUrl: 'html/controller_html.html'
})

export class AppControllerComponent {
	currentState: Boolean;
	constructor() {
		this.currentState = false;
	}



	onNotify(message:string):void {
	    alert(message);
	    this.currentState = !this.currentState;
	}
	

}

