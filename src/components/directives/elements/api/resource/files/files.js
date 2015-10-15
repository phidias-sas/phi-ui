(function() {
    'use strict';

    angular
        .module("phi.ui")
        .directive("phiApiResourceFiles", phiApiResourceFiles);


    function phiApiResourceFiles() {


        return {
            restrict: "E",

            scope: {
                src: "@"
            },

            bindToController: true,

            controller:       phiApiResourceFilesController,
            controllerAs:     "vm",

            template:   '<phi-gallery>' + 
                            '<phi-gallery-image ng-repeat="picture in vm.gallery.pictures" src="{{picture.preview|trustAsResourceUrl}}" thumbnail="{{picture.thumbnail|trustAsResourceUrl}}"></phi-gallery-image>' + 
                        '</phi-gallery>'
        };

        ///////////////////////////////////

        phiApiResourceFilesController.$inject = ["phiApi"];
        function phiApiResourceFilesController(phiApi) {

            var vm     = this;
            vm.gallery = null;

            phiApi.get(vm.src)
                .success(function(response) {
                    vm.gallery = response;

                    phiApi.get(vm.src)
                        .success(function(response) {
                            vm.gallery.pictures = response;
                        });

                });

        }

    }

})();