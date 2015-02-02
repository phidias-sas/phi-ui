//phi-viewport-leave(-start)
//phi-viewport-leave-end

//phi-viewport-enter(-start)
//phi-viewport-enter-end

angular.module("phi.ui").directive("phiViewportLeave", ["$window", "$phiCoordinates", "$timeout", function($window, $phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            $timeout(function() {
                var bounds = $phiCoordinates.getBounds(element);
                element.data("phi-viewport-element-top",    bounds.top);
                element.data("phi-viewport-element-bottom", bounds.top + bounds.height);
            }, 0);

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var elementTop    = element.data("phi-viewport-element-top");
                var elementBottom = element.data("phi-viewport-element-bottom");
                var leaveEvent    = null;

                if (lastY < elementTop && elementTop <= $window.scrollY) { //leaving from the top
                    leaveEvent = {
                        direction: "up"
                    }
                } else if (lastY + $window.innerHeight > elementBottom && elementBottom >= $window.scrollY + $window.innerHeight) { //leaving from the bottom
                    leaveEvent = {
                        direction: "down"
                    }
                }

                if (leaveEvent) {
                    scope.$eval(attributes.phiViewportLeave, {event: leaveEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;
                return;

            });

        }

    };


}]);



angular.module("phi.ui").directive("phiViewportLeaveEnd", ["$window", "$phiCoordinates", "$timeout", function($window, $phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            $timeout(function() {
                var bounds = $phiCoordinates.getBounds(element);
                element.data("phi-viewport-element-top",    bounds.top);
                element.data("phi-viewport-element-bottom", bounds.top + bounds.height);
            }, 0);

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var elementTop    = element.data("phi-viewport-element-top");
                var elementBottom = element.data("phi-viewport-element-bottom");
                var leaveEvent    = null;

                if (lastY < elementBottom && elementBottom <= $window.scrollY) { //leaving from the top
                    leaveEvent = {
                        direction: "up"
                    }
                } else if (lastY + $window.innerHeight > elementTop && elementTop >= $window.scrollY + $window.innerHeight) { //leaving from the bottom
                    leaveEvent = {
                        direction: "down"
                    }
                }

                if (leaveEvent) {
                    scope.$eval(attributes.phiViewportLeaveEnd, {event: leaveEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;
                return;

            });

        }

    };


}]);




angular.module("phi.ui").directive("phiViewportEnter", ["$window", "$phiCoordinates", "$timeout", function($window, $phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            $timeout(function() {
                var bounds = $phiCoordinates.getBounds(element);
                element.data("phi-viewport-element-top",    bounds.top);
                element.data("phi-viewport-element-bottom", bounds.top + bounds.height);
            }, 0);

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var elementTop    = element.data("phi-viewport-element-top");
                var elementBottom = element.data("phi-viewport-element-bottom");
                var enterEvent    = null;

                if (lastY + $window.innerHeight < elementTop && elementTop <= $window.scrollY + $window.innerHeight) { //entering from the top
                    enterEvent = {
                        direction: "up"
                    }
                } else if (lastY > elementBottom && elementBottom >= $window.scrollY) { //entering from the bottom
                    enterEvent = {
                        direction: "down"
                    }
                }

                if (enterEvent) {
                    scope.$eval(attributes.phiViewportEnter, {event: enterEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;
                return;

            });

        }

    };


}]);





angular.module("phi.ui").directive("phiViewportEnterEnd", ["$window", "$phiCoordinates", "$timeout", function($window, $phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            $timeout(function() {
                var bounds = $phiCoordinates.getBounds(element);
                element.data("phi-viewport-element-top",    bounds.top);
                element.data("phi-viewport-element-bottom", bounds.top + bounds.height);
            }, 0);

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var elementTop    = element.data("phi-viewport-element-top");
                var elementBottom = element.data("phi-viewport-element-bottom");
                var enterEvent    = null;

                if (lastY + $window.innerHeight < elementBottom && elementBottom <= $window.scrollY + $window.innerHeight) { //entering from the top
                    enterEvent = {
                        direction: "up"
                    }
                } else if (lastY > elementTop && elementTop >= $window.scrollY) { //entering from the bottom
                    enterEvent = {
                        direction: "down"
                    }
                }

                if (enterEvent) {
                    scope.$eval(attributes.phiViewportEnterEnd, {event: enterEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;
                return;

            });

        }

    };


}]);
