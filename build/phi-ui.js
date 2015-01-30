angular.module("phi.ui", ['ngAria']);

angular.module("phi.ui").service("$phiCoordinates", [function() {

    return {

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
angular.module("phi.ui").directive("phiCutout", [function() {

    return {
        restrict: "A",
        link: function(scope, element, attributes)  {
            element.prepend(angular.element('<div class="phi-cutout"><div></div><div></div><div></div></div>'));
        }
    };

}]);
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

angular.module("phi.ui").directive("phiInput", ['$timeout', function($timeout) {

    var phiInputCounter = 0;

    return {
        restrict: 'EA',

        scope: {
            name:     "@",
            type:     "@",
            label:    "@",
            error:    "@",
            invalid:  "@",
            disabled: "@",
            ngModel:  "=",
            ngChange: "&",
            ngFocus:  "&",
            ngBlur:   "&"
        },

        template:   '<label for="{{id}}" ng-bind="label"></label>' +
                    '<input id="{{id}}" ng-if="!multiline" type="text" ng-model="$parent.ngModel" ng-focus="focus()" ng-blur="blur()" ng-change="change()" />' +
                    '<textarea id="{{id}}" ng-if="multiline" name="{{name}}" ng-model="$parent.ngModel" ng-trim="false" ng-focus="focus()" ng-blur="blur()" ng-disabled="disabled == \'true\'" ng-change="change()"></textarea>' +
                    '<hr />',

        link: function(scope, element, attributes)  {

            element.attr("tabindex", -1); //prevent ngAria from setting tabindex

            scope.id = "phi-input-" + ++phiInputCounter;

            scope.floatinglabel = (typeof attributes.floatinglabel !== 'undefined') && attributes.floatinglabel !== 'false' && attributes.floatinglabel !== '0';
            scope.multiline     = (typeof attributes.multiline !== 'undefined') && attributes.multiline !== 'false' && attributes.multiline !== '0';

            //Different states this element can be in
            scope.state = {
                focused: false,
                empty: true
            };

            scope.focus = function() {
                scope.focused = true;
                scope.ngFocus();

                element.toggleClass('phi-input-focused', true);
            };

            scope.blur = function() {
                scope.focused = false;
                scope.ngBlur();

                element.toggleClass('phi-input-focused', false);
            };

            //see: http://stackoverflow.com/questions/24754005/how-to-implement-an-ng-change-for-a-custom-directive
            scope.change = function() {
                $timeout(scope.ngChange, 0);
            };

            scope.resizeTextarea = function() {
                if (scope.multiline) {
                    var textarea = element.find('textarea');
                    textarea.css("height", "auto");
                    textarea.css("height", Math.max(50, textarea[0].scrollHeight, textarea[0].clientHeight) + "px");
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

    var phiSelectCounter = 0;

    return {
        restrict: 'EA',

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

        compile: function(tElement, tAttrs) {

            phiSelectCounter++;

            var elementId = "phi-select-" + phiSelectCounter;

            return function(scope, element, attributes) {

                element.data("phiSelectId", elementId);

                scope.options = [];

                var children = tElement.children();
                for (var index = 0; index < children.length; index++) {
                    option = angular.element(children[index]);
                    scope.options.push({
                        label: option.html(),
                        value: option.attr("value")
                    });
                }

                var template = '<phi-input id="' + elementId + '" label="{{label}}" name="{{name}}" ng-model="currentSearch" ng-focus="focus()" ng-blur="blur()"></phi-input>' +
                               '<phi-menu phi-texture="paper" phi-tooltip-for="' + elementId + '" phi-tooltip-match="width" phi-visible="{{optionsVisible}}" class="phi-visible-slide-bottom">' +
                                   '<a ng-repeat="option in options" ng-bind="option.label" ng-click="select(option)" active="{{ngModel == option.value}}"></a>' +
                               '</phi-menu>';

                scope.currentSearch = scope.ngModel;
                scope.optionsVisible = false;


                scope.showOptions = function() {

                    if (scope.optionsVisible) {
                        return;
                    }

                    scope.optionsVisible = true;
                    $document.bind('click', scope.documentClicked);
                };

                scope.hideOptions = function() {
                    scope.optionsVisible = false;
                    $document.unbind('click', scope.documentClicked);
                };


                scope.select = function(option) {
                    scope.hideOptions();
                    scope.currentSearch  = option.label;
                    scope.ngModel        = option.value;
                    scope.ngChange();
                };

                scope.focus = function() {
                    scope.showOptions();
                    scope.ngFocus();
                };

                scope.blur = function() {
                    scope.ngBlur();
                };

                scope.documentClicked = function(e) {

                    if (angular.element(e.target).inheritedData('phiSelectId') == elementId) {
                        return;
                    }

                    scope.hideOptions();
                    scope.$apply();
                };

                var e = $compile(template)(scope);
                element.empty().append(e);

            };
        }

    };

}]);