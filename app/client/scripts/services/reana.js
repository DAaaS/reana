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

  	this.machines = helpers.overload({
  		'object': function(options){
  			var params = {
  				username: this.username(),
  				sessionId: this.sessionId()
  			};
  			return this.get('machines', params, options);
  		},
  		'promise': function(timeout){
  			return this.machines({timeout: timeout});
  		},
  		'': function(){
  			return this.machines({});
  		}
  	});

    this.templates = helpers.overload({
      'object': function(options){
        var params = {
          username: this.username(),
          sessionId: this.sessionId()
        };
        return this.get('templates', params, options);
      },
      'promise': function(timeout){
        return this.templates({timeout: timeout});
      },
      '': function(){
        return this.templates({});
      }
    });

    if(window.location.port == '3000'){
      helpers.generateRestMethods(this, "https://localhost:8181/api/");
    } else {
      helpers.generateRestMethods(this, "/api/");
    }
  });

})();