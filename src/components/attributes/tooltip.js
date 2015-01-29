angular.module("phi.ui").directive("phiTooltipFor", ["$timeout", function($timeout) {

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

				var parentElement     = document.getElementById(scope.parentId);
				var parentCoordinates = parentElement.getBoundingClientRect();
				var localCoordinates  = element[0].getBoundingClientRect();


				var coordinates = {
					top: window.scrollY,
					left: window.scrollX
				};

				//compensate for relative parents
				var offsetTop = (window.scrollY + localCoordinates.top - element[0].offsetTop);
				var offsetLeft = (window.scrollX + localCoordinates.left - element[0].offsetLeft);

				coordinates.top -= offsetTop;
				coordinates.left -= offsetLeft;

				//css transform displacements are taken into account, and getBoundingClientRect is run when the element is HIDDEN so
				//if the visibility css contains a transform, this will be fucked.   Manually subtracting the clss.slide.scss distance here:
				coordinates.top += 15;


				var verticalOrigin   = null;
				var horizontalOrigin = null;

				if (scope.origin) {
					var origin       = scope.origin.toLowerCase().split(" ");
					verticalOrigin   = origin.length ? origin[0] : null;
					horizontalOrigin = origin.length > 1 ? origin[1] : null;
				}

				switch (verticalOrigin) {

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

				switch (horizontalOrigin) {

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


				var verticalAlign   = null;
				var horizontalAlign = null;

				if (scope.align) {
					var align       = scope.align.toLowerCase().split(" ");
					verticalAlign   = align.length ? align[0] : null;
					horizontalAlign = align.length > 1 ? align[1] : null;
				}


				switch (verticalAlign) {
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

				switch (horizontalAlign) {
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


				var elementCoordinates = {
					top: coordinates.top + "px",
					left: coordinates.left + "px",
					right: coordinates.right + "px",
					bottom: coordinates.bottom + "px"
				};

				if (attributes.phiTooltipMatch == "width") {
					elementCoordinates.minWidth = parentCoordinates.width + "px";
				} else if (attributes.phiTooltipMatch == "height") {
					elementCoordinates.minHeight = parentCoordinates.height + "px";
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

            $timeout(scope.reposition, 0);
        }
    };

}]);