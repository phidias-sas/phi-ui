angular.module("myApp", ["phi.ui", "ui.router", "ngAria", "ngAnimate"]);

angular.module("myApp").config(["$urlRouterProvider", function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
}]);