
import { Component, Inject} from '@angular/core';
import { Client } from './client';


@Component({
	selector: 'login',
	templateUrl: 'views/login.html',
	providers: [Client]
})
export class Login {

	username: string = ""
	password: string = ""

	constructor(@Inject(Client) private client: Client){}

	submit(){
		this.client.login(this.username, this.password);
	}

}

