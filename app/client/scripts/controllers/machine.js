'use strict';

(function(){

	var app = angular.module('reanaApp');

	app.controller('MachineController', function($q, $scope, $uibModalInstance, $timeout, reana){
		var that = this;
		var timeout = $q.defer();
    	$scope.$on('$destroy', function(){ timeout.resolve(); });
    	this.token = reana.sessionId();
    	this.open = false;

    	$uibModalInstance.rendered.then(function(){
    		that.open = true;
    	});

        this.toFullScreen = function() {
            this.fullScreen = true;
        };

    	this.close = function() {
            $uibModalInstance.dismiss('cancel');
        };
	});

})();
