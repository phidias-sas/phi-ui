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
            onSearch: "&"

        },

        transclude: true,

        template:  '<a class="selection"></a>' +
                   '<phi-input id="{{elementId}}" label="{{label}}" name="{{name}}" ng-model="query" ng-focus="focus()" ng-blur="blur()" ng-keyup="onSearch({query: query})"></phi-input>' +
                   '<phi-menu ng-transclude phi-tooltip-for="{{elementId}}" phi-tooltip-match="width" phi-visible="{{state.expanded}}" class="phi-visible-slide-bottom phi-texture-paper"></phi-menu>',

        controller: ["$scope", "$element", function($scope, $element) {

            this.select = function(value, element) {
                $scope.ngModel = value;
                $scope.query   = value;
                $scope.collapse();
                $scope.ngChange();


                $element[0].querySelector('.selection').innerHTML = element[0].innerHTML;
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
                scope.query = scope.ngModel;
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