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
  var app = angular.module('reanaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ngStorage',
    'inform'
  ]);

  app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginController as loginController'
    });

    $stateProvider.state('home', {
      templateUrl: 'views/home.html',
      controller: 'HomeController as homeController',
      abstract: true,
    });

    $stateProvider.state('home.machines', {
      resolve: { authenticate: authenticate },
      url: '/',
      templateUrl: 'views/machines.html',
      controller: 'MachinesController as machinesController'
    });

    $stateProvider.state('home.data', {
      resolve: { authenticate: authenticate },
      url: '/data',
      templateUrl: 'views/data.html',
      controller: 'DataController as datasController'
    });

    $stateProvider.state('about', {
      url: '/about',
      templateUrl: 'views/about.html'
    });

    $urlRouterProvider.otherwise('/');

  });

  app.run(['$rootScope', '$state', function ($rootScope, $state, $sessionStorage) {
      $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      if (error && error.isAuthenticated === false) {
        $state.go('login');
      }
    });
  }])

  function authenticate($q, reana){
    if(reana.sessionId()){
      return true;
    } else {
      return $q.reject({isAuthenticated : false});
    }
  }

})();