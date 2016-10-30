

import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';

import {Hero} from '.hero';

@Injectable()
export class HeroService {


	private headers = new headers({'Content-Type': 'application/json'});
	private userURL = 'app/heroes';	//URL to API location.

	params: URLSearchParams = new URLSearchParams();
	
	constructor(private http: Http) {}


	getUserHtml(userType: string,params: URLSearchParams): Promise<Hero[]> {
		params.set('UserType',userType);
		return this.http.get(this.userURL,params)	//I'm trying to pass a variable to my API
			.toPromise()
			.then(response => response.json().data as Hero[])
			.catch(this.handleError);
	}

	getHtml(id: string): Promise<Hero> {
		return this.getHeroes()
			.then(heroes => heroes.find(hero => hero.id === id));
	}




}

