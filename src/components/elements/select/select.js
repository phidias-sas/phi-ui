/*
Same attributes as polymer's paper-element
*/

angular.module("phi.ui").directive("phiSelect", ["$compile", "$document", function($compile, $document) {

    var phiSelectCounter = 0;

    return {
        restrict: 'EA',

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

        compile: function(tElement, tAttrs) {

            phiSelectCounter++;

            var elementId = "phi-select-" + phiSelectCounter;

            return function(scope, element, attributes) {

                element.data("phiSelectId", elementId);

                scope.options = [];

                var children = tElement.children();
                for (var index = 0; index < children.length; index++) {
                    option = angular.element(children[index]);
                    scope.options.push({
                        label: option.html(),
                        value: option.attr("value")
                    });
                }

                var template = '<phi-input id="' + elementId + '" label="{{label}}" name="{{name}}" ng-model="currentSearch" ng-focus="focus()" ng-blur="blur()"></phi-input>' +
                               '<phi-menu phi-texture="paper" phi-tooltip-for="' + elementId + '" phi-tooltip-match="width" phi-visible="{{optionsVisible}}" class="phi-visible-slide-bottom">' +
                                   '<a ng-repeat="option in options" ng-bind="option.label" ng-click="select(option)" active="{{ngModel == option.value}}"></a>' +
                               '</phi-menu>';

                scope.currentSearch = scope.ngModel;
                scope.optionsVisible = false;


                scope.showOptions = function() {

                    if (scope.optionsVisible) {
                        return;
                    }

                    scope.optionsVisible = true;
                    $document.bind('click', scope.documentClicked);
                };

                scope.hideOptions = function() {
                    scope.optionsVisible = false;
                    $document.unbind('click', scope.documentClicked);
                };


                scope.select = function(option) {
                    scope.hideOptions();
                    scope.currentSearch  = option.label;
                    scope.ngModel        = option.value;
                    scope.ngChange();
                };

                scope.focus = function() {
                    scope.showOptions();
                    scope.ngFocus();
                };

                scope.blur = function() {
                    scope.ngBlur();
                };

                scope.documentClicked = function(e) {

                    if (angular.element(e.target).inheritedData('phiSelectId') == elementId) {
                        return;
                    }

                    scope.hideOptions();
                    scope.$apply();
                };

                var e = $compile(template)(scope);
                element.empty().append(e);

            };
        }

    };

}]);