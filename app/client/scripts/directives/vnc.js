

(function() {
    'use strict';

    var app = angular.module('reanaApp');

    app.directive('vnc', function(){
        return {
            restrict: 'E',
            scope: {
              token: '=',
              height: '=',
              width: '='
            },
            template: "<canvas></canvas>",
            controller: function($scope, $element){

                var host = window.location.hostname;
                var port = 29876;
                var path = "websockify?token=" + $scope.token;
                var width = $scope.width || $($element).parent().innerWidth();
                var height = $scope.height || $($element).parent().innerHeight();

                console.log(width, height);

                var noVnc = $($element).find('canvas').noVnc();
                noVnc.connect(host, port, '', path);
                noVnc.resize(width, height);

            }
        }
    });

})();

