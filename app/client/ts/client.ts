import { Inject, Injectable, Component } from '@angular/core';
import { Http, HTTP_PROVIDERS} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Client {

	token: string = null

	constructor(
		@Inject(Http) private http: Http,
		@Inject(CookieService) private cookieService:CookieService
	){
		this.token = cookieService.get('token');
	}

	login(username, password){
		var that = this;
		var url = '/api/authenticate?' + [
			'username=' + encodeURIComponent(username),
			'password=' + encodeURIComponent(password)
		].join('&');
		return this.http.get(url).map((result) => {
			this.token = result.json().token;
			that.cookieService.putObject('token', this.token);
			return;
		}).catch((error) => {
			return Observable.throw("Either username or password is incorrect.");
		});
	}

	isLoggedIn(){
		return this.token != null;
	}

}
