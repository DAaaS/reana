import {Component, View} from 'angular2/core';

@Component({
  selector: 'reana'
})

@View({
  templateUrl: 'reana.html'
})

export class Reana {

  constructor() {
    console.info('Reana Component Mounted Successfully');
  }

}
