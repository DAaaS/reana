'use strict';

(function(){

	var app = angular.module('reanaApp');

	app.controller('CreateMachineController', function($q, $scope, $uibModalInstance, $timeout, reana){
		var that = this;
		var timeout = $q.defer();
    	$scope.$on('$destroy', function(){ timeout.resolve(); });

        this.templateId = null;
        this.name = "";

        that.templates = [];
        reana.templates(timeout).then(function(templates){
            that.templates = templates;
        })


    	$uibModalInstance.rendered.then(function(){
    		that.open = true;
    	});

        this.create = function() {
            reana.createMachine(this.templateId, this.name, timeout).then(function(){
                $uibModalInstance.dismiss('cancel');
            });
        };

    	this.close = function() {
            $uibModalInstance.dismiss('cancel');
        };
	});

})();
