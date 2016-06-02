'use strict';

/**
 * @ngdoc overview
 * @name reanaApp
 * @description
 * # reanaApp
 *
 * Main module of the application.
 */
(function(){
angular
  .module('reanaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    });

    $stateProvider.state('about', {
      url: '/about',
      templateUrl: 'views/about.html'
    });

    $urlRouterProvider.otherwise('/');

  });

})();