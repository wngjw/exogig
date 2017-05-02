import { Component, Directive, Injectable, EventEmitter, Output, trigger, state, style, transition, animate } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { userService } from '../services/app.service.user';
import { artistService } from '../services/app.service.artist';
import { gigService } from '../services/app.service.gig';
import { User, Artist } from '../gig/app.gig.users';
import { Gig, SetList, Request, Song } from '../gig/app.gig.gig';
import { Observable } from 'rxjs';
import { WindowRef } from '../gig/app.gig.window';


@Component({
 	selector: 'band-page',
	templateUrl: '../html/band_page_html.html',
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

export class AppBandPageComponent {
	notify: EventEmitter<string> = new EventEmitter<string>();
	currentUser: User = new User();
	currentArtist: Artist = new Artist();
	artistService: artistService;
	artistName: string;
	eventname: string;
 	date: string;
 	location: string;
 	time: string;
	gigNamePlace:string;
	DateOfGigPlace:string;
	TimeOfGigPlace:string;
	gigs: Gig[];
	LocationOfGigPlace:string;
	editIndex:number;
	setlist:SetList[];
	songlist: Song[];

	loggedInSymbol: string;
	topOption: string;		//Shouldn't need.
	showLabels = false;
	buttonLabels: string[];
	buttonIcon: string[];
	pageEmitters: string[];
	http:Http;
	NewGig: Gig;
	selectedSetList: string;
	gigService: gigService;
	selectedIndex: number;
	status: string;

	blobObject: Blob;
	blobUrl: string; 
	window: WindowRef;

	constructor(http: Http, userService: userService, artistService: artistService, gigService: gigService, winRef: WindowRef) {
		this.http = http;
		this.NewGig = new Gig();
		
		this.gigService = gigService;
		this.currentUser = userService.getUser();
    	this.artistService = artistService;
		this.currentArtist = artistService.getArtist();
		this.artistName = this.currentArtist.Name;
		this.gigs = this.currentArtist.Gigs;
		this.buttonLabels = ['Home','Options','Info','Songs','Sets'];
    	this.buttonIcon = ['home','local_play','assignments','info_outline','search',];
    	this.pageEmitters = ['login','bandoptions','editbio','songlist','setlist'];
		this.gigNamePlace = "Gig Name";
		this.DateOfGigPlace = "Date of the Gig";
		this.TimeOfGigPlace = "Time of the Gig";
		this.LocationOfGigPlace = "Location of the Gig";
		this.editIndex = null;
		this.selectedIndex = null;
		this.setlist = this.currentArtist.Setlists;
		if(this.currentArtist.Songlist.length==0){
			this.status = 'redirect';
		}
		else{
			this.status = 'viewGigs';
		}
		this.songlist = this.currentArtist.Songlist;
		
		this.selectedSetList = "No set list has been selected";

		this.window = winRef;

		console.log(this.gigs);
	}

	public generatePrintableSetlist() {
		if (this.window.nativeWindow.File && this.window.nativeWindow.FileReader && this.window.nativeWindow.FileList && this.window.nativeWindow.Blob) {
			
			//This stores the generated HTML. - GigID isn't being found right now.
			var pageString = ["<html><link href=\"https://fonts.googleapis.com/css?family=Roboto+Slab\" rel=\"stylesheet\" type=\"text/css\"><head><br><center><h3 style=\"font-family:Roboto Slab\"><b>" + this.artistName + "</b></h3><h4 style=\"margin-bottom:0px;font-family:Roboto Slab\;text-decoration:underline\">" + this.gigs[this.selectedIndex].GigName +"</h4><h5 style=\"margin:0px;font-family:Roboto Slab\">"+ this.gigs[this.selectedIndex].GigId +"</h5></center></head><body>"];

			var tmpStr = "<span><h4 style=\"font-family:Roboto Slab;text-decoration:underline;margin-bottom:0px\">";
			console.log("GigSetList",this.NewGig.GigSetList.SetsInSetList);
			for(var n in this.NewGig.GigSetList.SetsInSetList) {
				var setName = this.NewGig.GigSetList.SetsInSetList[n].SetName;

				console.log("n: ",n);
				console.log("Obj: ",this.NewGig.GigSetList)
				
				tmpStr = tmpStr + setName + "</h4></span><ul style=\"font-family:Roboto Slab\">";
				for(var j in this.NewGig.GigSetList.SetsInSetList[n].SongsInSet) {
					var songName = 	this.NewGig.GigSetList.SetsInSetList[n].SongsInSet[j].Name;
					tmpStr = tmpStr + "<li>" + songName + "</li>";
				}
				tmpStr = tmpStr + "</ul>";
			}

			pageString[0] = pageString[0] + tmpStr + "</body></html>";

			console.log("HTML: ");
			console.log(pageString[0]);
			
			// Small Timeout to make sure the DOM is loaded.
    		setTimeout(()=>{
				this.blobObject = new Blob(pageString,{type: "text/html;charset=UTF-8"});
				var link = this.window.nativeWindow.document.getElementById('setlistLink');
				link.href = this.window.nativeWindow.URL.createObjectURL(this.blobObject);	//this item breaks it
			}, 100);
			//This will only work in IE.
			//this.window.nativeWindow.navigator.msSaveOrOpenBlob(this.blobObject, 'msSaveBlobOrOpenBlob_testFile.txt');
		} 
		else {
			alert('The File APIs are not fully supported in this browser.');
		}
		/*
		this.blobObject = new Blob(["NopeLope"], {type:"text/plain"});
		this.blobUrl = this.window.nativeWindow.URL.createObjectURL(this.blobObject);
		*/
	}

	public viewGig(index:number) {
		this.status = 'viewingGig';
		console.log("This far");
		this.selectedIndex = index;
		this.NewGig.GigSetList = this.setlist[index];
		this.selectedSetList = this.NewGig.GigSetList.SetListName;

		this.generatePrintableSetlist();
		
		console.log(this.selectedSetList);	
	}

	//Like 99% sure this just displays the "added" set, what saves it?
	public addSetToGig(n:number){
		console.log("in add set to gig");
		console.log(this.currentArtist.Gigs[this.selectedIndex].GigName);
		this.currentArtist.Gigs[this.selectedIndex].GigSetList = this.setlist[n];
		this.selectedSetList = this.setlist[n].SetListName;
		//console.log(this.selectedIndex);
		this.generatePrintableSetlist();

		//We need it to save, but this doesn't work. Going to have to troubleshoot this manually.
		this.save();
	}
	//Toggling function for label animations, placed on big white button
	public animateLabels() {
		this.showLabels = !this.showLabels;
	}

	public emit_event(location:string) {
		this.notify.emit(location);
	}
	
	public editGig(index:number){
		this.editIndex = index;				
    	console.log(typeof this.currentArtist);
						
		var gigToEdit = this.currentArtist.Gigs;						
		this.NewGig.GigName = gigToEdit[index].GigName;				
		this.NewGig.GigDate = gigToEdit[index].GigDate;				
		this.NewGig.GigTime = gigToEdit[index].GigTime;				
		this.NewGig.GigLocation = gigToEdit[index].GigLocation;		
		this.NewGig.GigSetList = gigToEdit[index].GigSetList;		
		this.NewGig.GigId = gigToEdit[index].GigId;	

		this.NewGig.GigId = gigToEdit[index].GigId;	

		this.selectedSetList = this.NewGig.GigSetList.SetListName;
	}		  

	private catchError(error: Response) {
		var errorMes = "This shit is mucked";
		return Observable.throw(errorMes);
	}

	public newGig() {	//Used to be NewGig() but i had a variable named that so I swapped them around	
		this.status = 'newGig';

		this.NewGig.GigName = "";
		this.NewGig.GigDate = "";
		this.NewGig.GigTime = "";
		this.NewGig.GigLocation = "";
		this.NewGig.GigRequestList = [];
		this.editIndex = null;
	}

	public enterGig() {
		if(this.selectedIndex !== null){
			console.log("Entering Gig");
			this.gigService.setGig(this.currentArtist.Gigs[this.selectedIndex]);
			console.log(this.currentArtist.Gigs[this.selectedIndex]);
			this.emit_event('gigviewer');
		}
	}

	public backoutGig() {
		this.status = "viewGigs";
		this.selectedIndex = null;
	}

	//this.selectedIndex was this.editIndex
	public deleteGig() {
		this.status = 'viewGigs';
		if(this.selectedIndex != null){
			this.currentArtist.Gigs.splice(this.selectedIndex,1);
		}
		this.save();
		this.gigs = this.currentArtist.Gigs;
	}

	public exitGig() {
		this.status = 'viewGigs';
	}

	public createGig(){
		console.log(this.newGig);
		var gen = true;
		this.status = 'viewGigs';

		// The post request which takes parameters of address, body, options
		console.log(gen, "before get call");

		//Will have to change editIndex to selectedIndex or w/e. Then call this function on editting Gig info.
		if(this.editIndex != null){
			this.currentArtist.Gigs[this.editIndex].GigName = this.NewGig.GigName;
			this.currentArtist.Gigs[this.editIndex].GigLocation = this.NewGig.GigLocation;
			this.currentArtist.Gigs[this.editIndex].GigDate = this.NewGig.GigDate;
			this.currentArtist.Gigs[this.editIndex].GigTime = this.NewGig.GigTime;
			this.currentArtist.Gigs[this.editIndex].GigId = this.NewGig.GigId;
		
			gen = false;
			console.log(this.currentArtist.Gigs[this.editIndex].GigId);
			this.save();
		}

		if(gen === true){
			console.log('in generate func');
			this.http.get('/generate')
				.map((res) => res.json())
				.catch(this.catchError)
				.subscribe((data) => this.setGigCode(data));
		}
		
		

	}

	private setGigCode(data: any) {
		console.log('setting gig code');
		console.log(data);
		this.NewGig.GigId = data;
		console.log(this.NewGig.GigId);
		var i = 0;
		for (i=0;i < this.currentArtist.Songlist.length;i++){
			var song = this.currentArtist.Songlist[i];
			Object.setPrototypeOf(song, Song);
			console.log(song);
			var request = new Request(song.Name, 0, data);
			this.NewGig.GigRequestList.push(request);
		}
		this.currentArtist.Gigs.push(this.NewGig);
  
		this.NewGig = new Gig();
		console.log(this.currentArtist.Gigs);
		this.gigs = this.currentArtist.Gigs;	//May not need ne more.
		
		this.save();
	}

	public save(){
		this.artistService.setArtist(this.currentArtist);
		console.log("We're saving",this.NewGig);
		var uploadObj = {
			key: this.currentArtist
		};
		let params: URLSearchParams = new URLSearchParams();
		for (let key in uploadObj) {
			params.set(key, uploadObj[key]);
		}
		var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');
		let options = new RequestOptions({
			search: params,
			headers: pageHeaders
		});
		console.log(this.currentArtist);
		let body = JSON.stringify(this.currentArtist);
		console.log("[DEBUG] body:", body);
		this.http.post('/addgig', body, options)
		.map((res) => res.json())
		.subscribe((res) => this.waitForHttp(res));
	}

	private waitForHttp(res: any) {
    if (res !== undefined) {
    		this.currentArtist = res as Artist;
   	}
		this.artistService.setArtist(this.currentArtist);
		this.NewGig=new Gig();
		this.gigNamePlace = "Gig Name";
		this.DateOfGigPlace = "Date of the Gig";
		this.TimeOfGigPlace = "Time of the Gig";
		this.LocationOfGigPlace = "Location of the Gig";
  }

  public addGigToServer(){
	//This will update what the current printable setlist is
	this.generatePrintableSetlist();

	console.log("This is the gig I'm posting");
	console.log(this.NewGig);
    var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');
		let options = new RequestOptions({
			headers: pageHeaders
		});
    let body = JSON.stringify(this.NewGig);
    this.http.post('/addgigtoserver', body, options)
      .map((res) => res.json())
      .subscribe((res) => this.addResponse(res));
  }

  private addResponse(res: any){
    console.log("Gig Added")
  }

  public removeGigFromServer() {
    var pageHeaders = new Headers();
		pageHeaders.append('Content-Type', 'application/json');
		let options = new RequestOptions({
			headers: pageHeaders
		});
    let body = JSON.stringify(this.NewGig.GigId);
    this.http.post('/removegig', body, options)
      .map((res) => res.json())
      .subscribe((res) => this.removeResponse(res));
  }

  private removeResponse(res: any) {
    console.log("Gig Removed")
  }
  
}
