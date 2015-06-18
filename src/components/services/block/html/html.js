(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiBlockHtml", phiBlockHtml);



    phiBlockHtml.$inject = ["phiApi"];
    function phiBlockHtml(phiApi) {

        var service = {

            type:        "html",
            title:       "texto html",
            description: "",

            initialize: initializeController,

            actions: {

                default: {
                    template: '<div ng-bind-html="html.body"></div>'
                },

                create: {

                    template:   '<form>' + 
                                    '<fieldset>' + 
                                        //'<phi-input multiline ng-model="html.body"></phi-input>' + 
                                        '<div text-angular ng-model="html.body"></div>' + 
                                    '</fieldset>' + 
                                    '<footer>' + 
                                        '<phi-button ng-click="vm.create()">crear</phi-button>' + 
                                        '<phi-button class="cancel" ng-click="vm.destroy()">cancelar</phi-button>' + 
                                    '</footer>' + 
                                '</form>',

                    controller:   mainController,
                    controllerAs: "vm"
                },

                modify: {

                    template:   '<form>' + 
                                    '<fieldset>' + 
                                        //'<phi-input multiline ng-model="html.body"></phi-input>' + 
                                        '<div text-angular ng-model="html.body"></div>' + 
                                    '</fieldset>' + 
                                    '<footer>' + 
                                        '<phi-button ng-click="vm.save()">guardar</phi-button>' + 
                                        '<phi-button class="cancel" ng-click="vm.cancel()">cancelar</phi-button>' + 
                                    '</footer>' + 
                                '</form>',

                    controller:   mainController,
                    controllerAs: "vm"
                },

                remove: {

                    template:   '<div>' + 
                                    '<h1>Eliminar este texto ?</h1>' +  
                                    '<footer>' + 
                                        '<phi-button ng-click="vm.remove()">eliminar</phi-button>' + 
                                        '<phi-button class="cancel" ng-click="vm.cancel()">cancelar</phi-button>' + 
                                    '</footer>' +                                         
                                '</div>',

                    controller:   mainController,
                    controllerAs: "vm"
                }

            }

        };

        return service;


        //////////////////

        initializeController.$inject = ["$scope", "phiBlockController"];
        function initializeController($scope, phiBlockController) {

            if ($scope.ngModel.url) {

                phiApi.get($scope.ngModel.url)
                    .success(function(response) {
                        $scope.html = response;
                    });

            } else {

                $scope.html = {
                    id:   null,
                    body: null
                };

                phiBlockController.openAction("create");

            }

        };


        mainController.$inject = ["$scope", "phiBlockController"];
        function mainController($scope, phiBlockController) {

            var vm     = this;
            vm.cancel  = cancel;
            vm.create  = create;
            vm.save    = save;
            vm.remove  = remove;
            vm.destroy = destroy;


            function cancel() {
                phiBlockController.openAction("default");
            }


            function create() {

                if (!$scope.ngModel.endpoint) {
                    //well, that was not configured properly
                    return;
                }

                phiApi.post($scope.ngModel.endpoint, $scope.html)
                    .success(function(response, code, headers) {
                        $scope.html.id     = response.id;
                        $scope.ngModel.url = headers("location");
                        phiBlockController.openAction("default");
                        phiBlockController.create();
                    });

            }


            function save() {

                phiApi.put($scope.ngModel.url, $scope.html)
                    .success(function(response, code, headers) {
                        phiBlockController.openAction("default");
                    });

            }


            function remove() {

                phiApi.remove($scope.ngModel.url)
                    .success(function(response, code, headers) {
                        phiBlockController.destroy();
                    });

            }


            function destroy() {
                phiBlockController.destroy();
            }


        };


    }

})();