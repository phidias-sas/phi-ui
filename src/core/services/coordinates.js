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