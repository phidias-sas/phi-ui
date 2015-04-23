/*
This directive will simply set the "phi-gallery-shown" class (and optionally the class you specify via phi-gallery-shown-class="") to one child element at a time and provide controls
to select the shown item.  All styling should be defined in your stylesheets

Usage:

//have a local variable "controls" which will be populated with the gallery's controls functions:

<div phi-gallery="controls" phi-gallery-shown-class="myOwnClass">
    <div>Element 1</div>
    <div>Element 2</div>
    ....
</div>

<h1>Now showing {{controls.selectedIndex}}</h1>

<button ng-click="controls.show(2)">See index 2</button>
<button ng-click="controls.previous()" ng-disabled="!controls.hasPrevious()">prev</button>
<button ng-click="controls.next()" ng-disabled="!controls.hasNext()">next</button>

*/

angular.module("phi.ui").directive("phiGallery", ["$timeout", function($timeout) {

    return {

        restrict: "A",

        scope: {
            controls: "=phiGallery",
            customClassName: "@phiGalleryShownClass"
        },


        link: function(scope, element, attributes)  {

            var items  = [];

            scope.controls   = scope.controls != undefined ? scope.controls : {};
            scope.shownClass = "phi-gallery-shown" + (scope.customClassName ? " "+scope.customClassName : "");

            scope.controls = {

                selectedIndex: null,
                length:        0,

                show: function(index) {

                    if (!items.length) {
                        return;
                    }

                    //only allow from 0 to items.length
                    index = Math.min(Math.max(index, 0), items.length);

                    if (items[index] == undefined) {
                        return;
                    }

                    if (scope.controls.selectedIndex !== null && items[scope.controls.selectedIndex] != undefined) {
                        angular.element(items[scope.controls.selectedIndex]).removeClass(scope.shownClass);
                    }

                    angular.element(items[index]).addClass(scope.shownClass);
                    scope.controls.selectedIndex = index;
                },

                next: function() {
                    scope.controls.show(scope.controls.selectedIndex + 1);
                },

                previous: function() {
                    scope.controls.show(scope.controls.selectedIndex - 1);
                },

                hasNext: function() {
                    return items[scope.controls.selectedIndex + 1] != undefined;
                },

                hasPrevious: function() {
                    return items[scope.controls.selectedIndex - 1] != undefined;
                }

            };



            scope.$watch(function () {

                items                 = element.children();
                scope.controls.length = items.length;

                if (scope.controls.selectedIndex == null) {
                    scope.controls.selectedIndex = 0;
                }

                if (items[scope.controls.selectedIndex] != undefined) {
                    angular.element(items[scope.controls.selectedIndex]).addClass(scope.shownClass);
                }


            });


        }
    };

}]);
