'use strict';

(function(){
 
  var app = angular.module('reanaApp');

  app.service('reana', function($sessionStorage, $rootScope, $timeout, helpers){
  	window.reana = this;

  	this.username = function(){
  		return $sessionStorage.username;
  	};

  	this.sessionId = function(){
  		return $sessionStorage.sessionId;
  	};

  	this.login = function(username, password){
  		return this.get('login', {username: username, password: password}).then(function(response){
  			$sessionStorage.username = username;
  			$sessionStorage.sessionId = response.sessionId;
  			$rootScope.$broadcast('session:change');
  		});
  	};

  	this.logout = function(){
  		delete $sessionStorage.username;
  		delete $sessionStorage.sessionId;
    	$sessionStorage.$apply();
    	$rootScope.$broadcast('session:change');
  	};

  	helpers.generateRestMethods(this, "/api/");
  });

})();