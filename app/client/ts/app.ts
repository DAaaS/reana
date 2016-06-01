
import { Component, provide, OnInit, Inject} from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, Route, Router, Redirect} from '@angular/router-deprecated';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Http, HTTP_PROVIDERS} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import {Client} from './client';

import { Login } from './login';
import { Home } from './home';

@Component({
  selector: 'app',
  templateUrl: 'views/app.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [Client]
})
@RouteConfig([
	{path: '/login', component: Login, name: 'Login'},
	{path: '/home', component: Home, name: 'Home'}
])
export class App implements OnInit {

	constructor(
		@Inject(Router) private router: Router,
		@Inject(Client) private client: Client
	){}

	ngOnInit(){
		if(this.client.isLoggedIn()){
			this.router.navigate(['Home']);
		} else {
			this.router.navigate(['Login']);
		}
	}

}

bootstrap(App, [
	ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	CookieService,
	provide(LocationStrategy, {useClass: HashLocationStrategy })
]);
