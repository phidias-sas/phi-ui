/*
Same attributes as polymer's paper-element
*/

angular.module("phi.ui").directive("phiMenu", [function() {

    return {
        restrict: "E",

        link: function(scope, element, attributes)  {

        }

    };

}]);


angular.module("phi.ui").directive("phiSubmenu", [function() {

    return {
        restrict: "E",

        scope: {
            "label": "@"
        },

        transclude: true,

        template: '<a class="phi-submenu-label" ng-bind="label" tabindex="0" ng-click="toggle()"></a>' +
                  '<div class="phi-submenu-contents" ng-transclude></div>',

        link: function(scope, element, attributes)  {

            scope.setExpanded = function(expanded) {

                scope.expanded = expanded;

                if (scope.expanded) {
                    element.attr("expanded", "expanded");
                    element.find("div").find("a").attr("tabindex", 0);
                } else {
                    element.removeAttr("expanded");
                    element.find("div").find("a").attr("tabindex", -1);
                }
            };

            scope.toggle = function() {
                scope.setExpanded(!scope.expanded);
            };

            scope.setExpanded(false);

            var items = element.find('a');
            for (var index = 0; index < items.length; index++) {
                if (angular.element(items[index]).attr("active") !== undefined) {
                    scope.setExpanded(true);
                    break;
                }
            }



        }

    };

}]);
