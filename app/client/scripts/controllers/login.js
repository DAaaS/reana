'use strict';

(function(){

  var app = angular.module('reanaApp');

  app.controller('LoginController', function(reana, inform){

  	this.username = "";
  	this.password = "";

  	this.login = function(){
  		reana.login(this.username, this.password).then(function(){}, function(){
  			inform.add('Either your username or password is incorrect.'); 
  		});
  	};

  });

})();
