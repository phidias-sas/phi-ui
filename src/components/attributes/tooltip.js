angular.module("phi.ui").directive("phiTooltipFor", ["$timeout", "$phiCoordinates", function($timeout, $phiCoordinates) {

    return {

        restrict: "A",

        scope: {
        	parentId: "@phiTooltipFor",
        	align:    "@phiTooltipAlign",
        	origin:   "@phiTooltipOrigin",
        },

        link: function(scope, element, attributes)  {

        	scope.reposition = function() {

	        	element.css("position", "absolute");

				var parentElement     = angular.element(document.getElementById(scope.parentId));
				var parentCoordinates = $phiCoordinates.getBounds(parentElement);
				var localCoordinates  = $phiCoordinates.getBounds(element);

				var coordinates = {
					top:  0,
					left: 0
				};

				var alignment = $phiCoordinates.parseAlignmentString(scope.align) || {vertical: "bottom", horizontal: "left"};

				switch (alignment.vertical) {
					case "top":
						coordinates.top += parentCoordinates.top;
					break;

					case "center":
						coordinates.top += parentCoordinates.top + parentCoordinates.height/2;
					break;

					case "bottom":
						coordinates.top += parentCoordinates.top + parentCoordinates.height;
					break;
				}

				switch (alignment.horizontal) {
					case "left":
						coordinates.left += parentCoordinates.left;
					break;

					case "center":
						coordinates.left += parentCoordinates.left + parentCoordinates.width/2;
					break;

					case "right":
						coordinates.left += parentCoordinates.left + parentCoordinates.width;
					break;
				}


				var origin = $phiCoordinates.parseAlignmentString(scope.origin) || {vertical: "top", horizontal: "left"};

				switch (origin.vertical) {
					case "bottom":
						coordinates.top -= localCoordinates.height;
					break;

					case "center":
						coordinates.top -= localCoordinates.height/2;
					break;
				}

				switch (origin.horizontal) {

					case "right":
						coordinates.left -= localCoordinates.width;
					break;

					case "center":
						coordinates.left -= localCoordinates.width/2;
					break;
				}


				var elementCoordinates = {
					top:    coordinates.top+"px",
					left:   coordinates.left+"px",
					right:  "auto",
					bottom: "auto"
				};

				if (attributes.phiTooltipMatch == "width") {
					elementCoordinates.minWidth = parentCoordinates.width+"px";
				} else if (attributes.phiTooltipMatch == "height") {
					elementCoordinates.minHeight = parentCoordinates.height+"px";
				}

	        	element.css(elementCoordinates);
        	};


			attributes.$observe("phiVisible", function() {
				scope.reposition();
			});

			attributes.$observe("phiTooltipAlign", function() {
				scope.reposition();
			});

            attributes.$observe("phiTooltipOrigin", function() {
				scope.reposition();
			});

            //Machete !!!
            $timeout(function() {
            	scope.reposition();
            	scope.$apply();
            }, 200);
        }
    };

}]);