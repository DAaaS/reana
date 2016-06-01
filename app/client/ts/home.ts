
import { Component, Inject} from '@angular/core';
import { Client } from './client';

@Component({
	selector: 'home',
	templateUrl: 'views/home.html',
	providers: [Client]
})
export class Home {

	constructor(@Inject(Client) private client: Client){}
	
}
