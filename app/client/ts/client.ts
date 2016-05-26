import { Inject, Injectable, Component } from '@angular/core';
import { Http, HTTP_PROVIDERS} from '@angular/http';

@Injectable()
export class Client {

	constructor(@Inject(Http) private http: Http){}

	login(username, password){
		this.http.get('/api/authenticate').subscribe(res => {
            console.log(res.json());
        });
	}

}
