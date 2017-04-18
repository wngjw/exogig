import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { userService } from '../services/app.service.user';
import { artistService } from '../services/app.service.artist';
import { gigService } from '../services/app.service.gig';
import { User, Artist } from '../gig/app.gig.users';
import { Gig, Request, SetList } from '../gig/app.gig.gig';
import { Observable } from 'rxjs';

@Component({
 	selector: 'gigviewer',
	templateUrl: '../html/gig_viewer_html.html',
	outputs: ['notify'],
	animations: [
		//Animation handling for nav labels.
  	trigger('labelstate', [
 			transition('void => *', [		//Starting styles on enter.
    			style({fontSize: '0px',height: '5px',width: '5px',marginTop: '40px',marginRight: '15px', opacity: '0'}),
    			animate(400)
  		]),
		transition('* => void', [		//Goal styles on exit.
    			animate(400, style({fontSize: '0px',height: '5px',width: '5px',marginTop: '40px',marginRight: '15px',opacity: '0'}))
  		])
		])
	]
})

export class AppGigViewerComponent {
  http: Http;
  buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];
	artistService: artistService;
  gigService: gigService;
  userService: userService;
	gigName: string;

  currentGig: Gig;
  gigCode: string;
  setList: SetList;
  requests: Request[];

	showLabels = false;
  notify: EventEmitter<string> = new EventEmitter<string>();

	constructor(http: Http, userService: userService, artistService:artistService, gigService: gigService) {
		this.http = http;
		this.buttonLabels = ['Home','Options','Info','Songs','Sets'];
    this.buttonIcon = ['home','local_play','assignments','info_outline','search',];
    this.pageEmitters = ['login','bandoptions','editbio','songlist','setlist'];
    this.artistService = artistService;
    this.gigService = gigService;
    this.userService = userService;

    this.currentGig = gigService.getGig();
		this.gigName  = this.currentGig.GigName;
    this.gigCode = this.currentGig.GigId;
    this.setList = this.currentGig.GigSetList;
    this.requests = this.currentGig.GigRequestList;
		

    /* notify and showLabels taken care of above. */
	}

	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}

	private catchError(error: Response) {
		var errorMes = "Failed http POST";
		return Observable.throw(errorMes);
	}

	public getRequests(){
		var uploadObj = {
		    key: this.gigCode
		};
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');
		let options = new RequestOptions({
  		headers: pageHeaders
		});
		let body = JSON.stringify(this.gigCode);
		this.http.post('/gigcode', body, options)
		  .map((res) => res.json())
      .catch(this.catchError)
		  .subscribe((res) => this.receiveNewGig(res));
	}

  public receiveNewGig(res: any) {
    if(res !== undefined) {
      var tempGig = res as Gig;
      if (tempGig.GigId !== this.gigCode) {
        console.log("Mismatched Gigs")
      } else {
        this.requests = tempGig.GigRequestList;
        this.currentGig = tempGig;
        this.gigCode = tempGig.GigId;
        console.log("Gig found and updated");
      }
    } else {
      console.log("No gig Received")
    }
  }
}
