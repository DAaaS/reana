///<reference path="../../../node_modules/angular2/typings/browser.d.ts"/>

import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

@Component({
  selector: 'main',
  template: '<div>Hello World!</div>'
})
class Main {

}

bootstrap(Main);
