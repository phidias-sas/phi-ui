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
				coordinates.top += 10;



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
					right:  coordinates.right+"px",
					bottom: coordinates.bottom+"px"
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

            $timeout(scope.reposition, 0);
        }
    };

}]);