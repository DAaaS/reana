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
            that.display = { height: $scope.height, fitTo: 'height'};
    	});

        this.toFullScreen = function() {
            this.display.fullScreen = true;
            this.fitTo = 'scale';
        };

    	this.close = function() {
            $uibModalInstance.dismiss('cancel');
        };
	});

})();
