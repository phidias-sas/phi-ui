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

        template:  '<div id="{{elementId}}">' +
                       '<label ng-bind="label"></label>' +
                       '<a class="selection"></a>' +
                       '<input type="text" tabindex="-1" ng-model="query" />' +
                   '</div>' +
                   '<phi-menu ng-transclude phi-tooltip-for="{{elementId}}" phi-tooltip-match="width" phi-visible="{{state.expanded}}" class="phi-visible-slide-bottom phi-texture-paper"></phi-menu>',

        controller: ["$scope", "$element", function($scope, $element) {

            this.select = function(value, element) {
                $scope.ngModel = value;
                $scope.collapse();
                $scope.ngChange();
                $element[0].querySelector('.selection').innerHTML = element[0].innerHTML;
            };

        }],


        link: function(scope, element, attributes) {

            scope.elementId = "phi-select-" + phiSelectCounter++;

            element.data("phiSelectId", scope.elementId);

            element.attr("tabindex", 0);

            element.on("focus", function() {
                scope.expand();
                scope.$apply();
            });

            scope.state = {
                expanded: false
            };

            scope.query = null;

            scope.expand = function() {

                if (scope.state.expanded) {
                    return;
                }

                scope.query = '';

                scope.state.expanded = true;
                element.toggleClass("phi-select-expanded", scope.state.expanded);
                element.find("input")[0].focus();
                $document.bind('click', scope.documentClicked);
            };

            scope.collapse = function() {
                scope.state.expanded = false;
                element.toggleClass("phi-select-expanded", scope.state.expanded);
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

                if (newValue == oldValue) {
                    return;
                }
                scope.onSearch({query: newValue});

            });

            scope.$watch("ngModel", function(newValue, oldValue) {
                element.toggleClass("phi-select-empty", !newValue || !newValue.length);
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