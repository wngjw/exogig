import { Input, Output, Component, Directive, Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import { MaterializeAction } from 'angular2-materialize';
import { GoogleAPILoader } from './gapi/app.gapi.gapiloader';
import { gigService } from './services/app.service.gig';


@Component({
 	selector: 'login-page',
	templateUrl: 'html/login_html.html',
	outputs: ['notify'],
})

export class AppLoginComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
  loginhtml: string;
	inputKey: string;		//On page <input> value
	entireGigObject: Object;
  promise = GoogleAPILoader.load();
	http: Http;

	modalActions = new EventEmitter<string|MaterializeAction>();

  public openModal() {
    	this.modalActions.emit({action:"modal",params:['open']});
  }
  public closeModal() {
    	this.modalActions.emit({action:"modal",params:['close']});
  }

	constructor(http: Http) {
		this.http = http;
	}


	public joinEvent(location:string) {
		console.log("[DEBUG] input key:",this.inputKey)

    // Stores value from input element
		var uploadObj = {
			key: this.inputKey
		};

    // Initialize parameters for URL
    let params: URLSearchParams = new URLSearchParams();

    // Saves key/value pairs to URL query string
		for(let key in uploadObj) {
			params.set(key, uploadObj[key]);
		}

    // Not using for now
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type','application/json');

    // Places parameters in query string
		let options = new RequestOptions({
			search: params,
      headers: pageHeaders
		});

    let body = JSON.stringify(this.inputKey);
    console.log("[DEBUG] body:", body);

    this.http.post('/kendrick', body, options)
      .map((res) => res.json())
      .subscribe(data => this.entireGigObject = data);

    // Old http get
		/*this.http.get('/kendrick', options)
    .map(res => res.json())
    .subscribe(data => this.entireGigObject = data);*/

		//Takes gigService and saves the returned object to it.
		//Since JS executes asynchronously, we timeout to let the server response come in and set the gigService value.
		//By placing gigService in the parameters, I'm telling Angular to inject the service here for use.
		setTimeout((gigService: gigService) => {
			console.log(this.entireGigObject);
			gigService.setGig(this.entireGigObject);
			this.notify.emit(location);
		},1000);
	}

  public signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

	public emit_event(location:string) {
		this.notify.emit(location);
	}
}
