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
                        template:   '<phi-api-resource-files src="{{phiObject.ngModel.url}}"></phi-api-resource-files>'
                    },

                    editor: {
                        controller:   editorController,
                        template:     '<phi-api-resource-files-editor src="{{phiObject.ngModel.url}}"></phi-api-resource-files-editor>'
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

            function initialize() {

                if ( phiObject.ngModel.url ) {
                    phiObject.go("default");
                    return;
                }

                phiObject.go("editor");

            }


            function editorController() {

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