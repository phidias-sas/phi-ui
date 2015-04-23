/*
This first block contains the state DECLARATION.

Here we define a state name and its three basic attributes:
url, templateUrl (i.e. view) and controller.

To ease readability, the controller is stored in a variable declared below.
As a rule, the controller variable will be named [stateName]Controller.

*/
angular.module("myApp").config(["$stateProvider", function($stateProvider) {

    $stateProvider.state("default", {

        url:         "/",
        templateUrl: "partials/default/default.html",
        controller:  defaultController

    });

}]);


/*
Now, we declare the variable [stateName]Controller containing the actual controller logic
*/
var defaultController = ["$scope", function($scope) {

    $scope.stuff = [];

}];