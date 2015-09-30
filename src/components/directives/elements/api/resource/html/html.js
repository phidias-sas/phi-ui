(function() {
    'use strict';

    angular
        .module("phi.ui")
        .directive("phiApiResourceHtml", phiApiResourceHtml);


    function phiApiResourceHtml() {

        return {
            restrict: "E",

            scope: {
                src: "@"
            },

            bindToController: true,
            controller:       phiApiResourceHtmlController,
            controllerAs:     "vm",

            template:   '<div ng-bind-html="vm.html.body"></div>'
        };


        phiApiResourceHtmlController.$inject = ["phiApi"];
        function phiApiResourceHtmlController(phiApi) {

            var vm  = this;
            vm.html = null;

            phiApi.get(vm.src)
                .success(function(response) {
                    vm.html = response;

                });

        }

    }

})();