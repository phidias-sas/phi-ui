(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiObjectPageBlockHtml", phiObjectPageBlockHtml);

    phiObjectPageBlockHtml.$inject = ["phiApi"];
    function phiObjectPageBlockHtml(phiApi) {

        return function(phiObject) {

            return {

                initialize: initialize,

                states: {

                    default: {
                        controller:   defaultController,
                        controllerAs: 'vm',
                        template:     '<div ng-bind-html="vm.body"></div>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: 'vm',                    
                        template:     '<text-angular ng-model="vm.body" ng-model-options="{default: 920, blur: 0}"></text-angular>'
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',                    
                        template:     '<h1>Are you sure ?</h1>' + 
                                      '<phi-button class="danger" ng-click="vm.confirm()">Delete</phi-button>'  + 
                                      '<phi-button class="cancel" ng-click="vm.cancel()">Cancel</phi-button>'
                    },

                    error: {
                        template: '<h1>error!</h1>'
                    }

                }

            };

            //////////////////////

            function initialize() {

                if ( phiObject.ngModel.url ) {
                    phiObject.go("default");
                    return;
                }

                if ( !phiObject.ngModel.collectionUrl ) {
                    phiObject.go("error");
                    return;
                }

                phiApi.post(phiObject.ngModel.collectionUrl)
                    .success(function(response, code, headers) {
                        phiObject.ngModel.url = headers("location");

                        // Play nice:  report ngModel changes to phiObject
                        phiObject.change();

                        phiObject.go("editor");
                    });

            }


            function defaultController() {

                var vm = this;

                phiApi.get(phiObject.ngModel.url)
                    .success(function(response) {
                        vm.body = response.body;
                    });
            }


            editorController.$inject = ["$scope"];
            function editorController($scope) {

                var vm = this;

                phiApi.get(phiObject.ngModel.url)
                    .success(function(response) {

                        vm.body = response.body;

                        $scope.$watch("vm.body", function(newValue, oldValue) {
                            if (newValue == oldValue || oldValue == undefined || newValue == undefined) {
                                return;
                            }
                            save(newValue);
                        });

                    });

                function save(htmlBody) {
                    phiApi.put(phiObject.ngModel.url, {body: htmlBody});
                }

            }


            function deleteController() {

                var vm     = this;
                vm.confirm = confirm;
                vm.cancel  = cancel;

                /////////////////

                function confirm() {

                    phiApi.delete(phiObject.ngModel.url)
                        .success(function(response) {
                            phiObject.destroy();
                        });

                }

                function cancel() {
                    phiObject.go("default");
                }

            }

        }


    }

})();