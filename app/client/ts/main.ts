///<reference path="../../../node_modules/angular2/typings/browser.d.ts"/>

import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {
	ROUTER_DIRECTIVES,
	ROUTER_PROVIDERS,
	Route,
	Redirect,
	RouteConfig
} from 'angular2/router';
import {
	LocationStrategy,
	HashLocationStrategy
} from 'angular2/platform/common';

@Component({
  selector: 'main',
  templateUrl: 'views/main.html'
})
class Main {
	message: string;

	constructor(){
		this.message = "Hello World";
	}
}

bootstrap(Main, [
	ROUTER_PROVIDERS,
	provide(LocationStrategy,{
		useClass: HashLocationStrategy
	})
]);
