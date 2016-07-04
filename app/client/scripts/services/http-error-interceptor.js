(function() {
    'use strict';

    var app = angular.module('reanaApp');

    app.service('HttpErrorInterceptor', function($q, $rootScope){

        this.responseError = function(rejection) {
            if(rejection.status == 403){
                $rootScope.$broadcast('http:forbidden');
            }
            return $q.reject(rejection);
        };

    });

})();
