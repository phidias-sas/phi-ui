(function() {
    'use strict';

    angular
        .module("phi.ui")
        .directive("phiApiResourceGallery", phiApiResourceGallery);


    function phiApiResourceGallery() {


        return {
            restrict: "E",

            scope: {
                src: "@"
            },

            bindToController: true,

            controller:       phiApiResourceGalleryController,
            controllerAs:     "vm",

            template:   '<phi-gallery>' + 
                            '<phi-gallery-image ng-repeat="picture in vm.gallery.pictures" src="{{picture.url|trustAsResourceUrl}}" thumbnail="{{picture.thumbnail|trustAsResourceUrl}}"></phi-gallery-image>' + 
                        '</phi-gallery>'
        };

        ///////////////////////////////////

        phiApiResourceGalleryController.$inject = ["phiApi"];
        function phiApiResourceGalleryController(phiApi) {

            var vm     = this;
            vm.gallery = null;

            phiApi.get(vm.src)
                .success(function(response) {
                    vm.gallery = response;

                    phiApi.get(vm.src + "/files")
                        .success(function(response) {
                            vm.gallery.pictures = response;
                        });

                });

        }

    }

})();