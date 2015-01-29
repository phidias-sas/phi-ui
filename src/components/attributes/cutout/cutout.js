angular.module("phi.ui").directive("phiCutout", [function() {

    return {
        restrict: "A",
        link: function(scope, element, attributes)  {
            element.prepend(angular.element('<div class="phi-cutout"><div></div><div></div><div></div></div>'));
        }
    };

}]);