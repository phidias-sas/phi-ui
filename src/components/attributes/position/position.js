angular.module("phi.ui").directive("phiPosition", [function() {

    return {

        restrict: "A",

        link: function(scope, element, attributes)  {

            element.parent().css("position", "relative");

            element.css({
                position: "absolute",
                top: "10px",
                right: "10px"
            });

        }
    };

}]);