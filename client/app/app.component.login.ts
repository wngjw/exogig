import { Component, Directive, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';


@Component({
 	selector: 'login-page',
	templateUrl: 'html/login_html.html'
})

export class AppLoginComponent {
	loginhtml: string;
	constructor() {
		//So when the component is loaded into view,
		//I'm going to run my http.get function.

		this.loginhtml = 'David Johnson';

	}


	http_example() {

		//return this.http.get('/checkme');
		//return xmlHttp.responseText;
	}


	public getval() {
		return this.loginhtml = '<h3>Hi Dad.</h3>';
	}
}

