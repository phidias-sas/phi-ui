angular.module("phi.ui", ['ngAria']);

angular.module('phi.ui').run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$location = $location;
}]);