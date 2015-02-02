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