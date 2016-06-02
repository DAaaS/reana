'use strict';

(function(){

	var app = angular.module('reanaApp');

	app.controller('DataController', function($q, $scope, reana){
		var that = this;
		var timeout = $q.defer();
    	$scope.$on('$destroy', function(){ timeout.resolve(); });

	});

})();
