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
                                        'No se han subido archivos' + 
                                    '</div>' + 

                                    '<phi-gallery>' + 
                                        '<phi-gallery-image ng-repeat="picture in gallery.pictures" src="{{picture.url|trustAsResourceUrl}}" thumbnail="{{picture.thumbnail|trustAsResourceUrl}}"></phi-gallery-image>' + 
                                    '</phi-gallery>' + 
                                '</div>'

                },


                create: {

                    template:   '<form>' +
                                    '<fieldset>' + 
                                        '<ul class="gallery-class-picker">' + 

                                            '<li ng-click="vm.create(\'gallery\')">' + 
                                                '<h1 phi-icon="fa-picture-o"></h1>' + 
                                                '<span>Galer&iacute;a de im&aacute;genes</span>' + 
                                            '</li>' + 

                                            '<li ng-click="vm.create(\'folder\')">' + 
                                                '<h1 phi-icon="fa-files-o"></h1>' + 
                                                '<span>Lista de archivos</span>' + 
                                            '</li>' + 

                                        '</ul>' + 
                                    '</fieldset>' + 

                                    '<footer>' + 
                                        '<phi-button ng-click="vm.destroy()" class="cancel">cancelar</phi-button>' + 
                                    '</footer>' + 
                                '</form>',

                    controller:   mainController,
                    controllerAs: "vm"
                },

                modify: {

                    template:   '<form>' +

                                    '<phi-api-folder url="{{ngModel.url}}/files" on-change="vm.reload()"></phi-api-folder>' + 

                                    '<footer>' + 
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

            function create(type) {

                $scope.gallery.type = type;

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