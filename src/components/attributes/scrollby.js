//phi-viewport-leave(-start)
//phi-viewport-leave-end

//phi-viewport-enter(-start)
//phi-viewport-enter-end

angular.module("phi.ui").directive("phiScrollby", ["$window", "$phiCoordinates", "$timeout", function($window, $phiCoordinates, $timeout) {

    return {

        restrict: "A",

        scope: {
        	listener: "&phiScrollby"
        },

        link: function(scope, element, attributes)  {

        	$timeout(function() {

        		var bounds = $phiCoordinates.getBounds(element);

	        	element.data("phi-scrollby-element-top",    bounds.top);
	        	element.data("phi-scrollby-element-bottom", bounds.top + bounds.height);

        	}, 0);


        	var lastY = $window.scrollY;

        	angular.element($window).bind("scroll", function() {

        		//changes in top of element
				var elementTop = element.data("phi-scrollby-element-top");
				var eventTop   = null;

        		if (lastY < elementTop && elementTop < $window.scrollY) {
        			eventTop = {
        				direction: "down",
        				position: "top"
        			}
        		} else if (lastY > elementTop && elementTop > $window.scrollY) {
        			eventTop = {
        				direction: "up",
        				position: "top"
        			}
        		}

        		//changes in bottom of element
				var elementBottom = element.data("phi-scrollby-element-bottom");
				var eventBottom   = null;

        		if (lastY < elementBottom && elementBottom < $window.scrollY) {
        			eventBottom = {
        				direction: "down",
        				position: "bottom"
        			}
        		} else if (lastY > elementBottom && elementBottom > $window.scrollY) {
        			eventBottom = {
        				direction: "up",
        				position: "bottom"
        			}
        		}


        		if (eventTop) {
        			console.log(eventTop);

        			scope.listener({event: eventTop});
        			scope.$apply();
        		}


        		if (eventBottom) {
        			console.log(eventBottom);

        			scope.listener({event: eventBottom});
        			scope.$apply();
        		}

        		lastY = $window.scrollY;
        		return;

        	});

        }
    };

}]);