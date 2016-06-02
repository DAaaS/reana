'use strict';

(function(){

	var app = angular.module('reanaApp');

	app.controller('HomeController', function($q, $scope, reana){
		var that = this;
		var timeout = $q.defer();
    	$scope.$on('$destroy', function(){ timeout.resolve(); });

	    this.machines = [];

	    reana.machines(timeout).then(function(machines){
    		that.machines = machines;
    	});

	});

})();
