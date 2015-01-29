angular.module("phi.ui").directive("phiPositionAround", [function() {

    return {

        restrict: "A",

        scope: {
        	referenceId: "@phiPositionAround",
        	reference:   "@phiPositionReference",
        	target:      "@phiPositionTarget",
        },

        link: function(scope, element, attributes)  {

        	element.css("position", "absolute");

			var parentElement     = document.getElementById(scope.referenceId);
			var parentCoordinates = parentElement.getBoundingClientRect();
			var localCoordinates  = element[0].getBoundingClientRect();

			var coordinates = {
				top: window.scrollY,
				left: window.scrollX
			};


			var verticalTarget = null;
			var horizontalTarget = null;

			if (scope.target) {
				var target       = scope.target.toLowerCase().split(" ");
				verticalTarget   = target.length ? target[0] : null;
				horizontalTarget = target.length > 1 ? target[1] : null;
			}

			switch (verticalTarget) {
				case "top":
					coordinates.top += parentCoordinates.top;
				break;

				default:
				case "bottom":
					coordinates.top += parentCoordinates.top + parentCoordinates.height;
				break;

				case "center":
					coordinates.top += parentCoordinates.top + parentCoordinates.height/2;
				break;
			}

			switch (horizontalTarget) {
				default:
				case "left":
					coordinates.left += parentCoordinates.left;
				break;

				case "right":
					coordinates.left += parentCoordinates.left + parentCoordinates.width;
				break;

				case "center":
					coordinates.left += parentCoordinates.left + parentCoordinates.width/2;
				break;
			}


			var verticalReference   = null;
			var horizontalReference = null;

			if (scope.reference) {
				var reference       = scope.reference.toLowerCase().split(" ");
				verticalReference   = reference.length ? reference[0] : null;
				horizontalReference = reference.length > 1 ? reference[1] : null;
			}


			switch (verticalReference) {
				default:
				case "top":
				break;

				case "bottom":
					coordinates.top -= localCoordinates.height;
				break;

				case "center":
					coordinates.top -= localCoordinates.height/2;
				break;
			}

			switch (horizontalReference) {
				default:
				case "left":
				break;

				case "right":
					coordinates.left -= localCoordinates.width;
				break;

				case "center":
					coordinates.left -= localCoordinates.width/2;
				break;
			}


			var elementCoordinates = coordinates;


			var elementCoordinates = {
				top: coordinates.top + "px",
				left: coordinates.left + "px",
				right: coordinates.right + "px",
				bottom: coordinates.bottom + "px"
			};

        	element.css(elementCoordinates);
        }
    };

}]);