import { Inject, Injectable, Component } from '@angular/core';
import { Http, HTTP_PROVIDERS} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Client {

	token: string = null
	username: string = null

	constructor(
		@Inject(Http) private http: Http,
		@Inject(CookieService) private cookieService:CookieService
	){
		this.token = cookieService.get('token');
		this.username = cookieService.get('username');
	}

	login(username, password){
		var that = this;
		var url = '/api/authenticate?' + [
			'username=' + encodeURIComponent(username),
			'password=' + encodeURIComponent(password)
		].join('&');
		return this.http.get(url).map((result) => {
			that.token = result.json().token;
			that.username = username;
			that.cookieService.putObject('token', that.token);
			that.cookieService.putObject('username', username);
			return;
		}).catch((error) => {
			return Observable.throw("Either username or password is incorrect.");
		});
	}

	logout(){
		
	}

	isLoggedIn(){
		return this.token != null;
	}

}
