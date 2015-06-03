(function() {
    'use strict';

    angular
        .module("phi.ui")
        .directive("phiBlock", phiBlock);


    phiBlock.$inject = ["$controller", "$compile"];
    function phiBlock($controller, $compile) {

        return {

            restrict: "E",

            scope: {
                ngModel:            "=",
                settings:           "=",
                assignControllerTo: "=",
                onCreate:           "&",
                onDestroy:          "&"
            },

            controller:   phiBlockController,
            controllerAs: "vm"
        };


        phiBlockController.$inject = ["$scope", "$element"];
        function phiBlockController($scope, $element) {

            var blockService  = loadBlockService($scope.ngModel.type);

            var blockScope     = $scope.$new(true);
            blockScope.ngModel = $scope.ngModel;

            var vm = this;

            vm.settings      = $scope.settings;
            
            vm.currentAction = null;
            vm.openAction    = openAction;
            
            vm.create        = create;
            vm.destroy       = destroy;

            initialize();


            //////////////////////


            function loadBlockService(type) {
                var serviceName = "phiBlock" + type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
                return angular.element(document.body).injector().get(serviceName);
            };


            function initialize() {

                $element.addClass($scope.ngModel.type);

                /* Assign controller to assign-controller-to attribute, if specified */
                if ($scope.assignControllerTo !== undefined) {
                    $scope.assignControllerTo = vm;
                }

                if (blockService.initialize) {
                    $controller(blockService.initialize, {'$scope': blockScope, 'phiBlockController': vm});
                }

                if (!vm.currentAction) {
                    vm.openAction("default");
                }

            };


            function openAction(actionName) {

                if (!actionName) {
                    actionName = "default";
                }

                if (blockService.actions[actionName] === undefined || vm.currentAction == actionName) {
                    return;
                }

                $element.removeClass("action-"+vm.currentAction);
                $element.addClass("action-"+actionName);

                vm.currentAction = actionName;

                var action = blockService.actions[actionName];

                if (action.controller) {
                    var controllerObj = $controller(action.controller, {'$scope': blockScope, 'phiBlockController': vm});
                    if (action.controllerAs) {
                        blockScope[action.controllerAs] = controllerObj;
                    }
                }

                if (action.template) {
                    var e = $compile(action.template)(blockScope);
                    $element.empty().append(e);
                }

            };


            function create() {
                $scope.onCreate();
            };


            function destroy() {
                $element.empty();
                blockScope.$destroy();

                $scope.onDestroy();
                $scope.$destroy();
            };


        };

    };

})();