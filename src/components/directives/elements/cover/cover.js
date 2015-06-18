/*
phi-cover is esentially a shorthand way of creating a <div> with a background-image css property

<phi-cover src="foo.jpg" />

will produce

<div style="background-image: url('foo.jpg')"></div>
*/

(function() {
    'use strict';

    angular.module("phi.ui")
        .directive("phiCover", phiCover);

    function phiCover() {

        return {
            restrict: 'E',

            scope: {
                src: "@",
                'default': "@"
            },

            link: function(scope, element, attributes) {

                attributes.$observe("src", function(src) {

                    var backgroundImage = "url('"+src+"')";
                    if (scope['default']) {
                        backgroundImage += ", url('"+scope['default']+"')";
                    }

                    element.css("background-image", backgroundImage);
                });

            }
        };

    };

})();