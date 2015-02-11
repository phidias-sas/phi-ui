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
            ngModel:  "=",
            ngChange: "&",
            ngFocus:  "&",
            ngBlur:   "&",
            onSearch: "&phiOnSearch"

        },

        transclude: true,

        template:  '<phi-input id="{{elementId}}" label="{{label}}" ng-model="query" tabindex="-1" ng-focus="expand()"></phi-input>' +
                   '<phi-menu ng-transclude phi-tooltip-for="{{elementId}}" phi-tooltip-match="width" phi-visible="{{state.expanded}}" class="phi-visible-slide-bottom phi-texture-paper"></phi-menu>',

        controller: ["$scope", "$element", function($scope, $element) {

            this.select = function(value, element) {
                $scope.ngModel = value;
                $scope.collapse();
                $scope.ngChange();
            };

        }],


        link: function(scope, element, attributes) {

            element.attr("tabindex", -1);

            scope.elementId = "phi-select-" + phiSelectCounter++;
            element.data("phiSelectId", scope.elementId);

            scope.query = null;

            scope.state = {
                expanded: false
            };


            scope.expand = function() {

                if (scope.state.expanded) {
                    return;
                }

                scope.query = '';

                scope.state.expanded = true;
                $document.bind('click', scope.documentClicked);
            };

            scope.collapse = function() {
                scope.state.expanded = false;
                scope.query          = scope.ngModel;
                $document.unbind('click', scope.documentClicked);
            };

            scope.documentClicked = function(e) {

                if (angular.element(e.target).inheritedData('phiSelectId') == scope.elementId) {
                    return;
                }

                scope.collapse();
                scope.$apply();
            };

            scope.$watch("query", function(newValue, oldValue) {

                if (newValue == oldValue || newValue == scope.ngModel) {
                    return;
                }
                scope.onSearch({query: newValue});

            });


            scope.$watch("ngModel", function(newValue, oldValue) {
                scope.query = newValue;
            });

        }

    };

}]);


angular.module("phi.ui").directive("option", ["$compile", "$interpolate", function($compile, $interpolate) {

    return {
        restrict: "E",
        require:  "^?phiSelect",

        scope: {
            value: "="
        },

        template:   '<a ng-click="select()" ng-transclude></a>',
        transclude: true,
        replace:    true,

        link: function(scope, element, attributes, phiSelectCtrl) {

            if (!phiSelectCtrl) {
                return;
            }

            scope.select = function() {
                return phiSelectCtrl.select(scope.value, element);
            };

        }
    };

}]);