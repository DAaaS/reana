import {Component, View} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {Reana} from 'reana';

@Component({
  selector: 'main'
})

@View({
  directives: [Reana],
  template: `
    <reana></reana>
  `
})

class Main {

}

bootstrap(Main);
