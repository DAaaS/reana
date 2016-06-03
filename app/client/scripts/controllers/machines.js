'use strict';

(function(){

	var app = angular.module('reanaApp');

	app.controller('MachinesController', function($q, $scope, $uibModal, reana, inform){
		var that = this;
		var timeout = $q.defer();
    	$scope.$on('$destroy', function(){ timeout.resolve(); });

	    this.machines = [];

	    reana.machines(timeout).then(function(machines){
    		that.machines = machines;
    	});

	    this.view = function(machine){
	    	that.machine = machine;
	    	$uibModal.open({
                templateUrl: 'views/machine.html',
                controller: 'MachineController as machineController',
                size : 'lg',
                scope: $scope
            }).opened.catch(function (error) {
                inform.add(error, {
                    'ttl': 0,
                    'type': 'danger'
                });
            });
	    };

	});

})();
