(function() {
    'use strict';

    angular.module("phi.ui")
        .directive("phiCover", phiCover);

    function phiCover() {

        return {
            restrict: 'E',
            transclude: true,
            template: '<div ng-transclude></div>',

            link: function(scope, element, attributes) {

                attributes.$observe("src", function(src) {
                    element.css("background-image", "url('"+src+"')");
                });

            }
        };

    };

})();