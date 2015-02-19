/*
Based on http://www.bennadel.com/blog/2756-experimenting-with-ngmodel-and-ngmodelcontroller-in-angularjs.htm
*/

angular.module("phi.ui").directive("phiSelect", ["$compile", "$document", "$timeout", function($compile, $document, $timeout) {

    var phiSelectCounter = 1;

    return {

        restrict: "E",

        require: "?ngModel",

        scope: {
            name:     "@",
            label:    "@",
            ngFocus:  "&",
            ngBlur:   "&",
            onSearch: "&phiOnSearch"

        },

        transclude: true,

        template:  '<div class="phi-select-header" id="{{elementId}}">' +
                       '<div ng-show="!state.expanded" class="phi-select-display" ng-click="expand()"></div>' +
                       //'<phi-input ng-show="state.expanded" label="{{label}}" ng-model="query" tabindex="-1"></phi-input>' +
                       '<input type="text" ng-show="state.expanded" ng-model="query" tabindex="-1" size="2" />' +
                   '</div>' +
                   '<phi-menu ng-transclude phi-tooltip-for="{{elementId}}" phi-tooltip-match="width" phi-visible="{{state.expanded}}" class="phi-visible-slide-bottom phi-texture-paper"></phi-menu>',

        controller: ["$scope", function($scope) {

            this.handleOptionClick = function(element) {
                return $scope.handleOptionClick(element);
            }

        }],


        link: function(scope, element, attributes, ngModelController) {

            element.attr("tabindex", 0);
            scope.elementId = "phi-select-" + phiSelectCounter++;
            element.data("phiSelectId", scope.elementId);

            element.on("focus", function() {
                scope.expand();
                scope.$apply();
            });


            var displayElement = angular.element(element.find('div')[1]);

            ngModelController.$render = function() {
                scope.$evalAsync( renderSelectedOption );
            };

            renderSelectedOption = function() {

                var option = findOptionWithValue(ngModelController.$viewValue);

                if ( option ) {
                    displayElement.html( option.html() );
                }

            };


            findOptionWithValue = function(value) {

                var options = element.find('phi-option');

                for ( var i = 0; i < options.length; i++ ) {

                    var option = angular.element( options[i] );

                    if ( option.attr("value") == value ) {
                        return option;
                    }

                }

                return null;

            };


            scope.query = null;
            scope.state = {
                expanded: false
            };


            scope.handleOptionClick = function(option) {

                ngModelController.$setViewValue(option.attr("value"));
                renderSelectedOption();
                scope.collapse();

            };

            scope.expand = function() {

                if (scope.state.expanded) {
                    return;
                }

                scope.query = '';
                scope.state.expanded = true;


                $timeout(function() {
                    element.find("input")[0].focus();
                }, 0)



                $document.bind('click', handleDocumentClick);
            };

            scope.collapse = function() {
                scope.state.expanded = false;
                scope.query          = scope.ngModel;
                $document.unbind('click', handleDocumentClick);
            };

            handleDocumentClick = function(e) {

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


        }

    };

}]);


angular.module("phi.ui").directive("phiOption", ["$compile", "$interpolate", function($compile, $interpolate) {

    return {
        restrict:   "E",
        require:    "^phiSelect",
        template:   '<a ng-click="select()" ng-transclude></a>',
        transclude: true,
        scope:      {},

        link: function(scope, element, attributes, phiSelectCtrl) {

            scope.select = function() {
                return phiSelectCtrl.handleOptionClick(element);
            };

        }
    };

}]);