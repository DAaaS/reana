'use strict';

(function(){

	var app = angular.module('reanaApp');

	app.controller('IndexController', function($state, $rootScope, reana){
	    var that = this;
	    this.$state = $state;
	    this.username = reana.username();

	    $rootScope.$on('session:change', function(){
	    	if(reana.sessionId()){
	    		$state.go('home.machines');
	    		that.username = reana.username();
	    	} else {
	    		$state.go('login');
	    		that.username = null;
	    	}
	    });


	    this.logout = function(){
	  		reana.logout();
	  	};

	});

})();