

(function() {
    'use strict';

    var app = angular.module('reanaApp');

    app.directive('fullscreen', function(){
        return {
            restrict: 'A',
            scope: {
              fullscreen: '='
            },
            controller: function($scope, $element, $timeout){
                $timeout(function(){
                    $(document.body).append($element);
                });

                $scope.$watch(function(){
                    if($scope.fullscreen){
                        show()
                        requestFullscreen();
                    }
                });

                $(document).on('webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange', fullscreenChange);
                $scope.$on('$destroy', function(){
                    $(document).unbind('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', fullscreenChange); 
                    $($element).remove();
                });


                function fullscreenChange(){
                    if(!isFullscreen()){
                        $scope.fullscreen = false;
                        hide();
                    }
                }

                function show(){
                    $(document.body).contents().hide();
                    $($element).show();
                }

                function hide(){
                    $(document.body).contents().show();
                    $($element).hide();
                }



                function isFullscreen(){
                    return fullscreenElement() !== undefined;
                }

                function fullscreenElement(){
                    return document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement;
                }

                function requestFullscreen(){
                    var element = document.body;
                    if (element.requestFullscreen) {
                      element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                      element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    } else if (element.msRequestFullscreen) {
                      element.msRequestFullscreen();
                    }
                }
            }
        }
    });

})();

