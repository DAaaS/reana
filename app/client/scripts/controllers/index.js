'use strict';

(function(){

	var app = angular.module('reanaApp');

	app.controller('IndexController', function($state, $rootScope, $interval, reana){
	    var that = this;
	    this.$state = $state;
	    this.username = reana.username();

	    var pollMachinesPromise;
	    $rootScope.$on('session:change', function(){
	    	if(reana.sessionId()){
	    		$state.go('home.machines');
	    		that.username = reana.username();
	    		pollMachinesPromise = $interval(function(){
			  		if(reana.sessionId()){
			  			reana.machines();
			  		}
			  	}, 10000);
	    	} else {
	    		$state.go('login');
	    		that.username = null;
	    		$interval.cancel(pollMachinesPromise);
	    	}
	    });

	    $rootScope.$on('http:forbidden', function(){
	    	reana.logout();
	    });

	    this.logout = function(){
	  		reana.logout();
	  	};

	});

})();