(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiBlockGallery", phiBlockGallery);


    phiBlockGallery.$inject = ["phiApi"];
    function phiBlockGallery(phiApi) {

        var service = {

            type:        "gallery",
            title:       "Galeria",
            description: "",

            initialize: initializeController,

            actions: {

                default: {

                    template:   '<div>' +

                                    '<div ng-show="!gallery.pictures.length">' + 
                                        'no hay nada' + 
                                    '</div>' + 

                                    '<phi-gallery>' + 
                                        '<phi-gallery-image ng-repeat="picture in gallery.pictures" src="{{picture.url}}" thumbnail="{{picture.thumbnail}}"></phi-gallery-image>' + 
                                    '</phi-gallery>' + 
                                '</div>'

                },


                create: {

                    template:   '<form>' +
                                    '<fieldset>' + 
                                        '<select ng-model="gallery.class">' + 
                                            '<option value="regular">regular</option>' + 
                                            '<option value="foo">foo</option>' + 
                                            '<option value="bar">bar</option>' + 
                                        '</select>' + 
                                    '</fieldset>' + 

                                    '<footer>' + 
                                        '<phi-button ng-click="vm.create()">crear</phi-button>' +
                                        '<phi-button ng-click="vm.destroy()" class="cancel">cancelar</phi-button>' + 
                                    '</footer>' + 
                                '</form>',

                    controller:   mainController,
                    controllerAs: "vm"
                },

                modify: {

                    template:   '<form>' +
                                    '<fieldset>' + 
                                        '<select ng-model="gallery.class" ng-change="vm.save()">' + 
                                            '<option value="regular">regular</option>' + 
                                            '<option value="foo">foo</option>' + 
                                            '<option value="bar">bar</option>' + 
                                        '</select>' + 
                                    '</fieldset>' + 

                                    '<phi-api-folder url="{{ngModel.url}}/files" on-change="vm.reload()"></phi-api-folder>' + 

                                    '<footer>' + 
                                        //'<phi-button ng-click="vm.save()">guardar</phi-button>' +
                                        '<phi-button ng-click="vm.cancel()" class="cancel">aceptar</phi-button>' + 
                                    '</footer>' + 
                                '</form>',

                    controller:   mainController,
                    controllerAs: "vm"
                },

                remove: {

                    template:   '<form>' + 
                                    '<h1>Eliminar esta galer&iacute;a ?</h1>' +
                                    '<footer>' + 
                                        '<phi-button ng-click="vm.remove()">eliminar</phi-button>' + 
                                        '<phi-button ng-click="vm.cancel()" class="cancel">cancelar</phi-button>' + 
                                    '</footer>' + 
                                '</form>',

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
                        $scope.gallery = response;

                        phiApi.get($scope.ngModel.url+"/files")
                            .success(function(response) {
                                $scope.gallery.pictures = response;
                            });

                    });

            } else {

                $scope.gallery = {
                    pictures: []
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
            vm.reload  = reload;

            function reload() {
                phiApi.get($scope.ngModel.url+"/files")
                    .success(function(response) {
                        $scope.gallery.pictures = response;
                    });                
            }

            function cancel() {
                phiBlockController.openAction("default");
            }

            function create() {

                if (!$scope.ngModel.endpoint) {
                    //well, that was not configured properly
                    return;
                }

                phiApi.post($scope.ngModel.endpoint, $scope.gallery)
                    .success(function(response, code, headers) {
                        $scope.ngModel.url = headers("location");
                        phiBlockController.openAction("modify");
                        phiBlockController.create();
                    });

            }

            function save() {

                phiApi.put($scope.ngModel.url, $scope.gallery)
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