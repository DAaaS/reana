
import { Component, Inject} from '@angular/core';
import { Client } from './client';
import { Router } from '@angular/router-deprecated';

@Component({
	selector: 'login',
	templateUrl: 'views/login.html',
	providers: [Client]
})
export class Login {

	username: string = ""
	password: string = ""
	isError: boolean = false

	constructor(
		@Inject(Router) private router: Router,
		@Inject(Client) private client: Client
	){}

	submit(){
		var that = this;
		this.client.login(this.username, this.password).subscribe((response) => {
			that.router.navigate(['Home']);
		}, (error) => {
			that.isError = true;
		});
	}

}
