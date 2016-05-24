
import { Component } from '@angular/core';
import { bootstrap }    from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app',
  templateUrl: 'views/app.html'
})
export class App {
	message: string;

	constructor(){
		this.message = "Hello World";
	}
}

bootstrap(App);
