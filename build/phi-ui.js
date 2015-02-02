angular.module("phi.ui", ['ngAria']);

angular.module('phi.ui').run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$location = $location;
}]);
angular.module("phi.ui").service("$phiCoordinates", [function() {

    return {

        /*
        From angular-material util.js
        https://github.com/angular/material/blob/master/src/core/util/util.js

        Return the bounding rectangle relative to the offset parent (nearest in the containment hierarchy positioned containing element)
        */
        getBounds: function(element, offsetParent) {

            var node       = element[0];
            offsetParent   = offsetParent || node.offsetParent || document.body;
            offsetParent   = offsetParent[0] || offsetParent;
            var nodeRect   = node.getBoundingClientRect();
            var parentRect = offsetParent.getBoundingClientRect();

            return {
                left:   nodeRect.left - parentRect.left,// + offsetParent.scrollLeft,
                top:    nodeRect.top  - parentRect.top,//  + offsetParent.scrollTop,
                width:  nodeRect.width,
                height: nodeRect.height
            };

        },

        parseAlignmentString: function(string) {

            if (string == undefined) {
                return null;
            }

            var vertical   = null;
            var horizontal = null;

            if (string.indexOf("center") != -1) {
                vertical   = "center";
                horizontal = "center";
            }

            if (string.indexOf("top") != -1) {
                vertical = "top";
            }

            if (string.indexOf("bottom") != -1) {
                vertical = "bottom";
            }

            if (string.indexOf("left") != -1) {
                horizontal = "left";
            }

            if (string.indexOf("right") != -1) {
                horizontal = "right";
            }

            if (!vertical || !horizontal) {
                return null;
            }

            return {
                vertical: vertical,
                horizontal: horizontal
            };

        }

    };

}]);
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

angular.module("phi.ui").directive("phiPosition", ["$phiCoordinates", function($phiCoordinates) {

    return {

        restrict: "A",

        scope: {},

        link: function(scope, element, attributes)  {

            element.parent().css("position", "relative");
            element.css("position", "absolute");

            scope.reposition = function(positionString) {

                var boundingRect = $phiCoordinates.getBounds(element);
                var alignment    = $phiCoordinates.parseAlignmentString(positionString) || {vertical: "top", horizontal: "left"};

                var coordinates  = {
                    top:        "auto",
                    left:       "auto",
                    bottom:     "auto",
                    right:      "auto",
                    marginTop:  0,
                    marginLeft: 0
                };

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

                element.css(coordinates);

            };

            attributes.$observe("phiPosition", function(positionString) {
                scope.reposition(positionString);
            });

        }
    };

}]);

/**
 * Proof of concept: Port an angular-material element
 */

(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.checkbox
 * @description Checkbox module!
 */
angular.module('phi.ui')
    .directive('phiCheckbox', ['inputDirective', MdCheckboxDirective]);

/**
 * @ngdoc directive
 * @name mdCheckbox
 * @module material.components.checkbox
 * @restrict E
 *
 * @description
 * The checkbox directive is used like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the checkbox is in the accent color by default. The primary color palette may be used with
 * the `phi-primary` class.
 *
 * @param {string} ng-model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ng-true-value The value to which the expression should be set when selected.
 * @param {expression=} ng-false-value The value to which the expression should be set when not selected.
 * @param {string=} ng-change Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} phi-no-ink Use of attribute indicates use of ripple ink effects
 * @param {string=} aria-label Adds label to checkbox for accessibility.
 * Defaults to checkbox's text. If no default text is found, a warning will be logged.
 *
 * @usage
 * <hljs lang="html">
 * <phi-checkbox ng-model="isChecked" aria-label="Finished?">
 *     Finished ?
 * </phi-checkbox>
 *
 * <phi-checkbox phi-no-ink ng-model="hasInk" aria-label="No Ink Effects">
 *     No Ink Effects
 * </phi-checkbox>
 *
 * <phi-checkbox ng-disabled="true" ng-model="isDisabled" aria-label="Disabled">
 *     Disabled
 * </phi-checkbox>
 *
 * </hljs>
 *
 */
function MdCheckboxDirective(inputDirective) {

    inputDirective = inputDirective[0];
    var CHECKED_CSS = 'phi-checked';

    return {
        restrict: 'E',
        transclude: true,
        require: '?ngModel',
        template:
            '<div class="phi-container" phi-ink-ripple phi-ink-ripple-checkbox>' +
                '<div class="phi-icon"></div>' +
            '</div>' +
            '<div ng-transclude class="phi-label"></div>',
        compile: compile
    };

    // **********************************************************
    // Private Methods
    // **********************************************************

    function compile (tElement, tAttrs) {

        tAttrs.type     = 'checkbox';
        tAttrs.tabIndex = 0;
        tElement.attr('role', tAttrs.type);

        return function postLink(scope, element, attr, ngModelCtrl) {

            var checked = false;

            // Reuse the original input[type=checkbox] directive from Angular core.
            // This is a bit hacky as we need our own event listener and own render
            // function.
            inputDirective.link.pre(scope, {
                on: angular.noop,
                0: {}
            }, attr, [ngModelCtrl]);

            element.on('click', listener)
                   .on('keypress', keypressHandler);

            ngModelCtrl.$render = render;

            function keypressHandler(ev) {
                if(ev.which === 32) {
                    ev.preventDefault();
                    listener(ev);
                }
            }

            function listener(ev) {
                if (element[0].hasAttribute('disabled')) return;

                scope.$apply(function() {
                    checked = !checked;
                    ngModelCtrl.$setViewValue(checked, ev && ev.type);
                    ngModelCtrl.$render();
                });
            }

            function render() {
                checked = ngModelCtrl.$viewValue;
                element.toggleClass(CHECKED_CSS, checked);
            }
        };
    }
}

})();
/*
Same attributes as polymer's paper-element
*/

angular.module("phi.ui").directive("phiInput", [function() {

    var phiInputCounter = 1;

    return {
        restrict: "E",

        scope: {
            name:        "@",
            label:       "@",
            placeholder: "@",
            ngModel:     "=",
            ngFocus:     "&",
            ngBlur:      "&"
        },

        template:   '<label for="{{elementId}}" ng-bind="label"></label>' +

                    '<input type="text" ng-if="!multiline" placeholder="{{placeholder}}" ng-focus="focus()" ng-blur="blur()" id="{{elementId}}" name="{{name}}" ng-model="$parent.ngModel" ng-disabled="state.disabled" />' +
                    '<textarea          ng-if="multiline"  placeholder="{{placeholder}}" ng-focus="focus()" ng-blur="blur()" id="{{elementId}}" name="{{name}}" ng-model="$parent.ngModel" ng-disabled="state.disabled" ng-trim="false"></textarea>' +

                    '<hr />',

        link: function(scope, element, attributes)  {

            scope.elementId     = "phi-input-" + phiInputCounter++;
            scope.floatinglabel = (typeof attributes.floatinglabel !== 'undefined') && attributes.floatinglabel !== 'false' && attributes.floatinglabel !== '0';
            scope.multiline     = (typeof attributes.multiline !== 'undefined') && attributes.multiline !== 'false' && attributes.multiline !== '0';

            scope.state = {
                focused:  false,
                empty:    true,
                disabled: (typeof attributes.disabled !== 'undefined') && attributes.disabled !== 'false' && attributes.disabled !== '0'
            };

            element.toggleClass("phi-input-disabled", scope.state.disabled);

            element.attr("tabindex", -1);

            element.on("focus", function() {
                var inputElement = scope.multiline ? element.find("textarea") : element.find("input");
                inputElement[0].focus();
            });


            scope.focus = function() {
                scope.state.focused = true;
                element.toggleClass('phi-input-focused', true);
                scope.ngFocus();
            };

            scope.blur = function() {
                scope.state.focused = false;
                element.toggleClass('phi-input-focused', false);
                scope.ngBlur();
            };


            scope.resizeTextarea = function() {
                if (scope.multiline) {
                    var textarea = element.find("textarea");
                    textarea.css("height", "auto");
                    textarea.css("height", Math.max(textarea[0].scrollHeight, textarea[0].clientHeight) + "px");
                }
            };

            scope.$watch("ngModel", function(newValue, oldValue) {
                scope.state.empty = newValue == undefined || !newValue.length;
                element.toggleClass('phi-input-empty', scope.state.empty);
                scope.resizeTextarea();
            });


        }

    };

}]);
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

/*
Same attributes as polymer's paper-element
*/

angular.module("phi.ui").directive("phiSelect", ["$compile", "$document", function($compile, $document) {

    var phiSelectCounter = 1;

    return {
        restrict: "E",

        scope: {
            name:     "@",
            label:    "@",
            error:    "@",
            invalid:  "@",
            disabled: "@",
            ngModel:  "=",
            ngChange: "&",
            ngFocus:  "&",
            ngBlur:   "&"
        },

        transclude: true,

        template:  '<phi-input id="{{elementId}}" label="{{label}}" name="{{name}}" ng-model="displayValue" ng-focus="focus()" ng-blur="blur()"></phi-input>' +
                   '<phi-menu ng-transclude phi-tooltip-for="{{elementId}}" phi-tooltip-match="width" phi-visible="{{state.expanded}}" class="phi-visible-slide-bottom phi-texture-paper">' +
                   '</phi-menu>',


        controller: ["$scope", function($scope) {

            this.select = function(value) {
                $scope.ngModel      = value;
                $scope.displayValue = value;
                $scope.collapse();
                $scope.ngChange();
            };

        }],


        link: function(scope, element, attributes) {

            scope.elementId = "phi-select-" + phiSelectCounter++;

            element.data("phiSelectId", scope.elementId);
            element.attr("tabindex", -1);
            element.on("focus", function() {
                element.find("phi-input")[0].focus();
            });

            scope.state = {
                expanded: false
            };

            scope.focus = function() {
                element.find("input")[0].select();
                scope.expand();
                scope.ngFocus();
            };

            scope.blur = function() {
                scope.displayValue = scope.ngModel;
                scope.ngBlur();
            };


            scope.expand = function() {
                if (scope.state.expanded) {
                    return;
                }
                scope.state.expanded = true;
                $document.bind('click', scope.documentClicked);
            };

            scope.collapse = function() {
                scope.state.expanded = false;
                $document.unbind('click', scope.documentClicked);
            };

            scope.documentClicked = function(e) {

                if (angular.element(e.target).inheritedData('phiSelectId') == scope.elementId) {
                    return;
                }

                scope.collapse();
                scope.$apply();
            };


            scope.$watch("ngModel", function(newValue) {
                scope.displayValue = newValue;
            });

        }

    };

}]);


angular.module("phi.ui").directive("option", ["$compile", "$interpolate", function($compile, $interpolate) {

    return {

        restrict: "E",
        require:  "^?phiSelect",

        scope: {},

        link: function(scope, element, attributes, phiSelectCtrl) {

            if (!phiSelectCtrl) {
                return;
            }


            scope.value = attributes.value;

            scope.selectThis = function() {
                return phiSelectCtrl.select(scope.value);
            };

            var template = '<a ng-click="selectThis()">' + $interpolate(element.html())(scope.$parent) + '</a>';
            var e = $compile(template)(scope);
            element.replaceWith(e);
        }

    };

}]);
angular.module("phi.ui").directive("phiCutout", [function() {

    return {
        restrict: "C",
        link: function(scope, element, attributes)  {
            element.prepend(angular.element('<div class="phi-cutout-ridge"><div></div><div></div><div></div></div>'));
        }
    };

}]);