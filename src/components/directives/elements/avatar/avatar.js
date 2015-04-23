(function() {
    'use strict';

    angular.module("phi.ui")
        .directive('phiAvatar', phiAvatar);


    function phiAvatar() {

        return {
            restrict: 'E',
            template:

                '<div>' +
                    '<img ng-src="{{src}}" />' +
                '</div>',

            scope: {
                src: "@"
            }

        };

    };

})();