
import { Component, provide, OnInit, Inject} from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, Route, Router, Redirect} from '@angular/router-deprecated';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { Login } from './login';

@Component({
  selector: 'app',
  templateUrl: 'views/app.html',
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	{path: '/login', component: Login, name: 'Login'}
])
export class App implements OnInit {

	constructor(@Inject(Router) private router: Router){}

	ngOnInit(){
		this.router.navigate(['Login']);
	}

}

bootstrap(App, [
	ROUTER_PROVIDERS,
	provide(LocationStrategy, {useClass: HashLocationStrategy })
]);
