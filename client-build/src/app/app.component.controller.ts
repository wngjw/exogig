import { Component, Directive, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';


@Component({
 	selector: 'controller-page',
	templateUrl: 'html/controller_html.html'
})

export class AppControllerComponent {
	currentState: string;
	constructor() {
		this.currentState = 'login';
	}



	onNotify(location:string):void {
	    this.currentState = location;
	}
	

}

