angular.module("phi.ui", ["ngAria"]);

angular.module('phi.ui').run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$location = $location;
}]);
angular.module("phi.ui").service("$phiCoordinates", ["$timeout", function($timeout) {

    return {

        /*
        Based on angular-material util.js
        https://github.com/angular/material/blob/master/src/core/util/util.js

        Return the bounding rectangle relative to the offset parent (nearest in the containment hierarchy positioned containing element)

        Caches results every 500ms, so it's safe to call it continuously (like inside a window.scroll event)

        */
        getBounds: function(element, offsetParent) {

            $timeout.cancel(element.clearBoundsTimeout);

            element.clearBoundsTimeout = $timeout(function() {
                element.data("phi-coordinates-bounds", null);
            }, 500);

            var bounds = element.data("phi-coordinates-bounds");

            if (!bounds) {
                var node       = element[0];
                offsetParent   = offsetParent || node.offsetParent || document.body;
                offsetParent   = offsetParent[0] || offsetParent;
                var nodeRect   = node.getBoundingClientRect();
                var parentRect = offsetParent.getBoundingClientRect();

                bounds = {
                    left:   nodeRect.left - parentRect.left,
                    top:    nodeRect.top - parentRect.top,
                    width:  nodeRect.width,
                    height: nodeRect.height,
                    bottom: nodeRect.top - parentRect.top + nodeRect.height
                };

                element.data("phi-coordinates-bounds", bounds);
            }

            return bounds;

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

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var bounds     = $phiCoordinates.getBounds(element);
                var leaveEvent = null;

                if (lastY < bounds.top && bounds.top <= $window.scrollY) { //leaving from the top
                    leaveEvent = {
                        direction: "up"
                    }
                } else if (lastY + $window.innerHeight > bounds.bottom && bounds.bottom >= $window.scrollY + $window.innerHeight) { //leaving from the bottom
                    leaveEvent = {
                        direction: "down"
                    }
                }

                if (leaveEvent) {
                    scope.$eval(attributes.phiViewportLeave, {event: leaveEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;

            });

        }

    };


}]);



angular.module("phi.ui").directive("phiViewportLeaveEnd", ["$window", "$phiCoordinates", "$timeout", function($window, $phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            scope.scrollListener = function() {

                var bounds     = $phiCoordinates.getBounds(element);
                var leaveEvent = null;

                if (lastY < bounds.bottom && bounds.bottom <= $window.scrollY) { //leaving from the top
                    leaveEvent = {
                        direction: "up"
                    }
                } else if (lastY + $window.innerHeight > bounds.top && bounds.top >= $window.scrollY + $window.innerHeight) { //leaving from the bottom
                    leaveEvent = {
                        direction: "down"
                    }
                }

                if (leaveEvent) {
                    scope.$eval(attributes.phiViewportLeaveEnd, {event: leaveEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;
            };


            angular.element($window).bind("scroll", scope.scrollListener);

            element.on('$destroy', function() {
                angular.element($window).unbind("scroll", scope.scrollListener);
            });

        }

    };


}]);




angular.module("phi.ui").directive("phiViewportEnter", ["$window", "$phiCoordinates", "$timeout", function($window, $phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var bounds     = $phiCoordinates.getBounds(element);
                var enterEvent = null;

                if (lastY + $window.innerHeight < bounds.top && bounds.top <= $window.scrollY + $window.innerHeight) { //entering from the top
                    enterEvent = {
                        direction: "up"
                    }
                } else if (lastY > bounds.bottom && bounds.bottom >= $window.scrollY) { //entering from the bottom
                    enterEvent = {
                        direction: "down"
                    }
                }

                if (enterEvent) {
                    scope.$eval(attributes.phiViewportEnter, {event: enterEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;

            });

        }

    };


}]);





angular.module("phi.ui").directive("phiViewportEnterEnd", ["$window", "$phiCoordinates", "$timeout", function($window, $phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var bounds     = $phiCoordinates.getBounds(element);
                var enterEvent = null;

                if (lastY + $window.innerHeight < bounds.bottom && bounds.bottom <= $window.scrollY + $window.innerHeight) { //entering from the top
                    enterEvent = {
                        direction: "up"
                    }
                } else if (lastY > bounds.top && bounds.top >= $window.scrollY) { //entering from the bottom
                    enterEvent = {
                        direction: "down"
                    }
                }

                if (enterEvent) {
                    scope.$eval(attributes.phiViewportEnterEnd, {event: enterEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;

            });

        }

    };


}]);

/*
This directive will simply set the "phi-gallery-shown" class (and optionally the class you specify via phi-gallery-shown-class="") to one child element at a time and provide controls
to select the shown item.  All styling should be defined in your stylesheets

Usage:

//have a local variable "controls" which will be populated with the gallery's controls functions:

<div phi-gallery="controls" phi-gallery-shown-class="myOwnClass">
    <div>Element 1</div>
    <div>Element 2</div>
    ....
</div>

<h1>Now showing {{controls.selectedIndex}}</h1>

<button ng-click="controls.show(2)">See index 2</button>
<button ng-click="controls.previous()" ng-disabled="!controls.hasPrevious()">prev</button>
<button ng-click="controls.next()" ng-disabled="!controls.hasNext()">next</button>

*/

angular.module("phi.ui").directive("phiGallery", ["$timeout", function($timeout) {

    return {

        restrict: "A",

        scope: {
            controls: "=phiGallery",
            customClassName: "@phiGalleryShownClass"
        },


        link: function(scope, element, attributes)  {

            var items  = [];

            scope.controls   = scope.controls != undefined ? scope.controls : {};
            scope.shownClass = "phi-gallery-shown" + (scope.customClassName ? " "+scope.customClassName : "");

            scope.controls = {

                selectedIndex: null,
                length:        0,

                show: function(index) {

                    if (!items.length) {
                        return;
                    }

                    //only allow from 0 to items.length
                    index = Math.min(Math.max(index, 0), items.length);

                    if (items[index] == undefined) {
                        return;
                    }

                    if (scope.controls.selectedIndex !== null && items[scope.controls.selectedIndex] != undefined) {
                        angular.element(items[scope.controls.selectedIndex]).removeClass(scope.shownClass);
                    }

                    angular.element(items[index]).addClass(scope.shownClass);
                    scope.controls.selectedIndex = index;
                },

                next: function() {
                    scope.controls.show(scope.controls.selectedIndex + 1);
                },

                previous: function() {
                    scope.controls.show(scope.controls.selectedIndex - 1);
                },

                hasNext: function() {
                    return items[scope.controls.selectedIndex + 1] != undefined;
                },

                hasPrevious: function() {
                    return items[scope.controls.selectedIndex - 1] != undefined;
                }

            };



            scope.$watch(function () {

                items                 = element.children();
                scope.controls.length = items.length;

                if (scope.controls.selectedIndex == null) {
                    scope.controls.selectedIndex = 0;
                }

                if (items[scope.controls.selectedIndex] != undefined) {
                    angular.element(items[scope.controls.selectedIndex]).addClass(scope.shownClass);
                }


            });


        }
    };

}]);

/*
The phi-modal attribute only moves the element to the bottom of the body.
visibility can be established with the phi-visible attribute, and styling
is entirely up to the document
*/

angular.module("phi.ui").directive("phiModal", ["$document", function($document) {

    return {

        restrict: "A",

        link: function(scope, element, attributes)  {
        	angular.element($document[0].body).append(element);
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
            type:        "@",
            label:       "@",
            placeholder: "@",
            ngModel:     "=",
            ngFocus:     "&",
            ngBlur:      "&"
        },

        template:   '<div>' +
                        '<label for="{{elementId}}" ng-bind="label"></label>' +
                        '<input type="{{type||\'text\'}}" ng-if="!multiline" placeholder="{{placeholder}}" ng-focus="focus()" ng-blur="blur()" id="{{elementId}}" name="{{name}}" ng-model="$parent.ngModel" ng-disabled="state.disabled" />' +
                        '<textarea ng-if="multiline" placeholder="{{placeholder}}" ng-focus="focus()" ng-blur="blur()" id="{{elementId}}" name="{{name}}" ng-model="$parent.ngModel" ng-disabled="state.disabled" ng-trim="false"></textarea>' +
                    '</div>' +
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
Based on http://www.bennadel.com/blog/2756-experimenting-with-ngmodel-and-ngmodelcontroller-in-angularjs.htm
*/

angular.module("phi.ui").directive("phiSelect", ["$compile", "$document", "$timeout", function($compile, $document, $timeout) {

    var phiSelectCounter = 1;

    return {

        restrict: "E",

        require: "?ngModel",

        scope: {
            name:     "@",
            label:    "@",
            ngFocus:  "&",
            ngBlur:   "&",
            onSearch: "&phiOnSearch"
        },

        transclude: true,

        template:  '<div class="phi-select-header" id="{{elementId}}">' +
                       '<div ng-show="!state.expanded" class="phi-select-display" ng-click="expand()"></div>' +
                       '<input type="text" ng-show="state.expanded" ng-model="query" tabindex="-1" size="2" />' +
                   '</div>' +
                   '<phi-menu ng-transclude phi-tooltip-for="{{elementId}}" phi-tooltip-match="width" phi-visible="{{state.expanded}}" class="phi-visible-slide-bottom phi-texture-paper"></phi-menu>',


        controller: ["$scope", function($scope) {

            this.handleOptionClick = function(element) {
                return $scope.handleOptionClick(element);
            }

        }],


        link: function(scope, element, attributes, ngModelController) {

            element.attr("tabindex", 0);
            scope.elementId = "phi-select-" + phiSelectCounter++;
            element.data("phiSelectId", scope.elementId);

            element.on("focus", function() {
                scope.expand();
                scope.$apply();
            });

            var displayElement = angular.element(element.find('div')[1]);

            ngModelController.$render = function() {
                scope.$evalAsync( renderSelectedOption );
            };


            function renderSelectedOption() {

                var option = findOptionWithValue(ngModelController.$viewValue);

                if ( option ) {
                    displayElement.html( option.html() );
                }

            };


            function findOptionWithValue(value) {

                var options = element.find('phi-option');

                for ( var i = 0; i < options.length; i++ ) {
                    var option = angular.element( options[i] );
                    if ( option.attr("value") == value ) {
                        return option;
                    }
                }

                return null;

            };

            function handleDocumentClick(e) {

                if (angular.element(e.target).inheritedData('phiSelectId') == scope.elementId) {
                    return;
                }

                scope.$apply(scope.collapse);
            };


            scope.query = null;
            scope.state = {
                expanded: false
            };


            scope.handleOptionClick = function(option) {
                ngModelController.$setViewValue(option.attr("value"));
                ngModelController.$render();
                scope.collapse();
            };

            scope.expand = function() {

                if (scope.state.expanded) {
                    return;
                }

                scope.query = '';
                scope.state.expanded = true;

                $timeout(function() {
                    element.find("input")[0].focus();
                }, 0);

                $document.bind('click', handleDocumentClick);
            };


            scope.collapse = function() {
                scope.query          = null;
                scope.state.expanded = false;
                $document.unbind('click', handleDocumentClick);
            };



            scope.$watch("query", function(newValue, oldValue) {

                if (newValue == oldValue) {
                    return;
                }
                scope.onSearch({query: newValue});

            });


        }

    };

}]);


angular.module("phi.ui").directive("phiOption", ["$compile", "$interpolate", function($compile, $interpolate) {

    return {
        restrict:   "E",
        require:    "^phiSelect",
        template:   '<a ng-click="select()" ng-transclude></a>',
        transclude: true,
        scope:      {},

        link: function(scope, element, attributes, phiSelectCtrl) {

            scope.select = function() {
                return phiSelectCtrl.handleOptionClick(element);
            };

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