angular.module("phi.ui", []);

/*
Same attributes as polymer's paper-element
*/

var phiInputCounter = 0;

angular.module("phi.ui").directive("phiInput", ['$timeout', function($timeout) {

    return {
        restrict: 'EA',

        scope: {
            name:     "@",
            type:     "@",
            label:    "@",
            error:    "@",
            invalid:  "@",
            disabled: "@",
            ngModel:  "=",
            ngChange: "&",
            ngFocus:  "&",
            ngBlur:   "&"
        },

        template:   '<label for="{{id}}" ng-bind="label"></label>' +
                    '<input id="{{id}}" ng-show="!multiline" type="text" ng-model="ngModel" ng-focus="focus()" ng-blur="blur()" ng-change="change()" />' +
                    '<textarea id="{{id}}" ng-show="multiline" name="{{name}}" ng-model="ngModel" ng-trim="false" ng-focus="focus()" ng-blur="blur()" ng-disabled="disabled == \'true\'" ng-change="change()"></textarea>' +
                    '<hr />',

        link: function(scope, element, attributes)  {

            scope.id = "phi-input-" + ++phiInputCounter;

            scope.floatinglabel = (typeof attributes.floatinglabel !== 'undefined') && attributes.floatinglabel !== 'false' && attributes.floatinglabel !== '0';
            scope.multiline     = (typeof attributes.multiline !== 'undefined') && attributes.multiline !== 'false' && attributes.multiline !== '0';

            //Different states this element can be in
            scope.state = {
                focused: false,
                empty: true
            };

            scope.focus = function() {
                scope.focused = true;
                scope.ngFocus();

                element.toggleClass('phi-input-focused', true);
            };

            scope.blur = function() {
                scope.focused = false;
                scope.ngBlur();

                element.toggleClass('phi-input-focused', false);
            };

            //see: http://stackoverflow.com/questions/24754005/how-to-implement-an-ng-change-for-a-custom-directive
            scope.change = function() {
                $timeout(scope.ngChange, 0);
            };

            scope.resizeTextarea = function() {
                if (scope.multiline) {
                    var textarea = element.find('textarea');
                    textarea.css("height", "auto");
                    textarea.css("height", Math.max(50, textarea[0].scrollHeight, textarea[0].clientHeight) + "px");
                }
            };


            scope.$watch("ngModel", function(newValue, oldValue) {
                scope.state.empty = newValue == undefined || !newValue.length;
                element.toggleClass('phi-input-empty', scope.state.empty);
                scope.resizeTextarea();
            });


        }

    };

}]);