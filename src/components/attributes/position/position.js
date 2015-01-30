angular.module("phi.ui").directive("phiPosition", ["$phiCoordinates", function($phiCoordinates) {

    return {

        restrict: "A",

        link: function(scope, element, attributes)  {

            element.css("position", "absolute");

            var boundingRect = element[0].getBoundingClientRect();
            var coordinates  = {};
            var alignment    = $phiCoordinates.parseAlignmentString(attributes.phiPosition) || {vertical: "top", horizontal: "left"};

            switch (alignment.vertical) {

                case "top":
                    coordinates.top = "10px";
                break;

                case "center":
                    coordinates.top       = "50%";
                    coordinates.marginTop = (boundingRect.height * -0.5) + "px";
                break;

                case "bottom":
                    coordinates.bottom = "10px";
                break;

            }

            switch (alignment.horizontal) {

                case "left":
                    coordinates.left = "10px";
                break;

                case "center":
                    coordinates.left       = "50%";
                    coordinates.marginLeft = (boundingRect.width * -0.5) + "px";
                break;

                case "right":
                    coordinates.right = "10px";
                break;

            }

            element.parent().css("position", "relative");
            element.css(coordinates);

        }
    };

}]);
