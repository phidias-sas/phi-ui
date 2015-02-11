angular.module("phi.ui", ['ngAria']);

angular.module('phi.ui').run(["$rootScope", "$location", function($rootScope, $location) {

	$rootScope.$location = $location;

	$rootScope.cities = ['cyan', 'default', 'amber', 'blue-grey', 'blue', 'brown', 'deep-orange', 'deep-purple', 'green', 'grey', 'indigo', 'light-blue', 'light-green', 'lime', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'];

}]);