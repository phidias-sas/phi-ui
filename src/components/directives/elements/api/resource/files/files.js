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

            controller:       phiApiResourceFilesController,
            controllerAs:     "vm",
            bindToController: true,

            template:   '<ul>' +
                            '<li ng-repeat="item in vm.files" class="phi-api-resource-files-file" ng-class="{selected: selected.url == item.url}" ng-click="select(item)">' +
                                '<a class="thumbnail" target="_blank" href="{{item.url}}">' +
                                    '<img ng-if="!!item.thumbnail" ng-src="{{item.thumbnail}}" />' +
                                '</a>' +
                                '<a class="details" target="_blank" href="{{item.url}}">' +
                                    '<h3 ng-bind="item.title"></h3>' +
                                    '<p>{{item.size|bytes}} - {{item.name}}</p>' +
                                '</a>' +
                            '</li>' +
                        '</ul>'
        };

        ///////////////////////////////////

        phiApiResourceFilesController.$inject = ["phiApi"];
        function phiApiResourceFilesController(phiApi) {

            var vm   = this;
            vm.files = [];

            phiApi.get(vm.src)
                .success(function(response) {
                    vm.files = response;
                });

        }

    }

})();