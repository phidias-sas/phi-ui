(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiObjectPageBlockFiles", phiObjectPageBlockFiles);

    phiObjectPageBlockFiles.$inject = ["phiApi"];
    function phiObjectPageBlockFiles(phiApi) {

        return function(phiObject) {

            return {

                initialize: initialize,

                states: {

                    default: {
                        controller: loadFiles,
                        template:   '<div>' + 
                                        '<ul>' + 
                                            '<li ng-repeat="file in phiObject.files">' + 
                                                '<a href="{{file.url}}" target="_blank">' + 
                                                    '<img ng-src="{{file.thumbnail}}" />' + 
                                                '</a>' + 
                                            '</li>' + 
                                        '</ul>' + 
                                    '</div>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: 'vm',
                        template:     '<phi-api-filesystem url="{{phiObject.ngModel.url}}"></phi-api-filesystem>'
                    },

                    delete: {
                        template:   '<form>' + 
                                        '<h1>Eliminar esta carpeta ?</h1>' +
                                        '<footer>' + 
                                            '<phi-button ng-click="phiObject.destroy()">eliminar</phi-button>' + 
                                            '<phi-button ng-click="phiObject.go(\'default\')" class="cancel">cancelar</phi-button>' + 
                                        '</footer>' + 
                                    '</form>',
                    }

                }

            };

            //////////////////////

            function loadFiles() {

                phiApi.get(phiObject.ngModel.url)
                    .success(function(response) {
                        phiObject.files = response;
                    });

            }

            function initialize() {

                if ( phiObject.ngModel.url ) {
                    phiObject.go("default");
                    return;
                }

                phiObject.go("editor");

            }


            function editorController() {
                var vm = this;

                if ( !phiObject.ngModel.url ) {
                    //make one up I guess!
                    var random = Math.floor((Math.random() * 10000) + 1);

                    phiObject.ngModel.url = phiObject.ngModel.collectionUrl + "/block" + random;
                    phiObject.change();
                }
            }

        }


    }

})();