/*

someObject = {
    title: "Object title",
    description: "Some description"
}


<phi-object type="book" ng-model="someObject" controller-as="myBook"></phi-object>

<phi-button ng-click="myBook.go('edit')">Editar</phi-button>


*/
(function() {
    'use strict';

    angular
        .module("phi.ui")
        .directive("phiObject", phiObject);

    function phiObject() {

        var objectService;

        return {

            restrict: "E",

            scope: {
                type:         "@",
                ngModel:      "=",
                controllerAs: "=",
                onChange:     "&",
                onDestroy:    "&"
            },

            controller:       phiObjectController,
            controllerAs:     "vm",

            link: phiObjectLink

        };

        ////////////////////////

        phiStatesController.$inject = ["$scope", "$element", "$controller", "$compile"];
        function phiObjectController($scope, $element, $controller, $compile) {

            var scope;

            var vm          = this;

            vm.ngModel      = $scope.ngModel;
            vm.onChange     = $scope.onChange;
            vm.onDestroy    = $scope.onDestroy;

            vm.states       = [];
            vm.currentState = null;
            vm.go           = go;

            vm.isLoading    = false;
            vm.setLoading   = setLoading;

            vm.change       = change;
            vm.destroy      = destroy;


            /* Load states from corresponding service */
            objectService   = loadObjectService($scope.type, vm);
            vm.states       = objectService.states;


            /* Setup external controller */
            vm.controller = {
                states:       vm.states,
                currentState: vm.currentState,
                go:           go,
                isLoading:    vm.isLoading
            };

            if ($scope.controllerAs != undefined) {
                $scope.controllerAs = vm.controller;
            }

            /////////////

            function go(targetStateName) {

                if (scope) {
                    scope.$destroy();
                    scope = null;
                }

                scope = $scope.$new(true);

                if (vm.states[targetStateName] === undefined || vm.currentState == targetStateName) {
                    return;
                }

                $element.removeClass("phi-object-state-"+vm.currentState);
                $element.addClass("phi-object-state-"+targetStateName);

                vm.currentState            = targetStateName;
                vm.controller.currentState = targetStateName;

                var targetState = vm.states[targetStateName];

                if (targetState.controller) {

                    var controllerObj = $controller(targetState.controller, {'$scope': scope, 'phiStatesController': vm});

                    if (targetState.controllerAs) {
                        scope[targetState.controllerAs] = controllerObj;
                    }
                }

                if (targetState.template) {
                    var e = $compile(targetState.template)(scope);
                    $element.empty().append(e);
                }

            }

            function change() {
                vm.onChange();
            }

            function destroy() {
                vm.onDestroy();
            }

            function setLoading(isLoading) {
                vm.isLoading            = isLoading;
                vm.controller.isLoading = isLoading;
            }

        }

        function phiObjectLink(scope) {

            var vm = scope.vm;

            if (typeof objectService.initialize == "function") {
                objectService.initialize();
            } else {
                vm.go(Object.keys(vm.states)[0]);
            }

        }

        function loadObjectService(type, vm) {

            var words = type.split("-").map(function(word) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            });

            var serviceName  = "phiObject" + words.join("");
            var blockFactory = angular.element(document.body).injector().get(serviceName);

            return blockFactory(vm);

        };

    };

})();