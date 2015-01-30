/*
Same attributes as polymer's paper-element
*/

angular.module("phi.ui").directive("phiSelect", ["$compile", "$document", function($compile, $document) {

    var phiSelectCounter = 1;

    return {
        restrict: "E",

        scope: {
            name:     "@",
            label:    "@",
            error:    "@",
            invalid:  "@",
            disabled: "@",
            ngModel:  "=",
            ngChange: "&",
            ngFocus:  "&",
            ngBlur:   "&"
        },

        transclude: true,

        template:  '<phi-input id="{{elementId}}" label="{{label}}" name="{{name}}" ng-model="displayValue" ng-focus="focus()" ng-blur="blur()"></phi-input>' +
                   '<phi-menu ng-transclude phi-tooltip-for="{{elementId}}" phi-tooltip-match="width" phi-visible="{{state.expanded}}" class="phi-visible-slide-bottom phi-texture-paper">' +
                   '</phi-menu>',


        controller: ["$scope", function($scope) {

            this.select = function(value) {
                $scope.ngModel      = value;
                $scope.displayValue = value;
                $scope.collapse();
                $scope.ngChange();
            };

        }],


        link: function(scope, element, attributes) {

            scope.elementId = "phi-select-" + phiSelectCounter++;

            element.data("phiSelectId", scope.elementId);
            element.attr("tabindex", -1);
            element.on("focus", function() {
                element.find("phi-input")[0].focus();
            });

            scope.state = {
                expanded: false
            };

            scope.focus = function() {
                element.find("input")[0].select();
                scope.expand();
                scope.ngFocus();
            };

            scope.blur = function() {
                scope.displayValue = scope.ngModel;
                scope.ngBlur();
            };


            scope.expand = function() {
                if (scope.state.expanded) {
                    return;
                }
                scope.state.expanded = true;
                $document.bind('click', scope.documentClicked);
            };

            scope.collapse = function() {
                scope.state.expanded = false;
                $document.unbind('click', scope.documentClicked);
            };

            scope.documentClicked = function(e) {

                if (angular.element(e.target).inheritedData('phiSelectId') == scope.elementId) {
                    return;
                }

                scope.collapse();
                scope.$apply();
            };


            scope.$watch("ngModel", function(newValue) {
                scope.displayValue = newValue;
            });

        }

    };

}]);


angular.module("phi.ui").directive("option", ["$compile", "$interpolate", function($compile, $interpolate) {

    return {

        restrict: "E",
        require:  "^?phiSelect",

        scope: {},

        link: function(scope, element, attributes, phiSelectCtrl) {

            if (!phiSelectCtrl) {
                return;
            }


            scope.value = attributes.value;

            scope.selectThis = function() {
                return phiSelectCtrl.select(scope.value);
            };

            var template = '<a ng-click="selectThis()">' + $interpolate(element.html())(scope.$parent) + '</a>';
            var e = $compile(template)(scope);
            element.replaceWith(e);
        }

    };

}]);