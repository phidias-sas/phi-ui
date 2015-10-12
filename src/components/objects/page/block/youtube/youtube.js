(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiObjectPageBlockYoutube", phiObjectPageBlockYoutube);

    phiObjectPageBlockYoutube.$inject = ["phiApi"];
    function phiObjectPageBlockYoutube(phiApi) {

        return function(phiObject) {

            return {

                initialize: initialize,

                states: {

                    default: {
                        controller:     defaultController,
                        controllerAs:   'vm',
                        template:       '<div>' +
                                            '<p ng-show="!phiObject.ngModel.videoId">El v&iacute;deo no es v&aacute;lido</p>' +
                                            '<p ng-show="!!phiObject.ngModel.videoId" ng-bind="phiObject.ngModel.title"></p>' +
                                            '<iframe ng-if="!!phiObject.ngModel.videoId" width="100%" height="420" ng-src="{{\'http://www.youtube.com/embed/\' + phiObject.ngModel.videoId | trustAsResourceUrl}}" frameborder="0" allowfullscreen></iframe>' + 
                                        '</div>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: 'vm',
                        template:   '<form>' +
                                        '<fieldset>' + 

                                            '<phi-input ng-model="phiObject.ngModel.url" label="URL de youtube"></phi-input>' +

                                            '<p ng-show="!phiObject.ngModel.videoId" class="notice">Debes ingresar una direcci&oacute;n v&aacute;lida de YouTube</p>' +

                                            '<div ng-show="!!phiObject.ngModel.videoId" class="description">' + 
                                                '<phi-input ng-model="phiObject.ngModel.title" label="titulo"></phi-input>' +
                                                '<phi-input multiline ng-model="phiObject.ngModel.description" label="descripci&oacute;n"></phi-input>' +
                                                '<img ng-if="!!phiObject.ngModel.thumbnail" ng-src="{{phiObject.ngModel.thumbnail}}" />' +
                                            '</div>' + 
                                        '</fieldset>' + 

                                        '<footer>' + 
                                            '<phi-button ng-show="!!phiObject.ngModel.videoId" ng-click="vm.save()">guardar</phi-button>' +
                                            '<phi-button ng-click="vm.cancel()" class="cancel">cancelar</phi-button>' + 
                                        '</footer>' + 
                                    '</form>'
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',
                        template:   '<form>' + 
                                        '<h1>Eliminar este video ?</h1>' +
                                        '<footer>' + 
                                            '<phi-button ng-click="vm.confirm()">eliminar</phi-button>' + 
                                            '<phi-button ng-click="vm.cancel()" class="cancel">cancelar</phi-button>' + 
                                        '</footer>' + 
                                    '</form>',
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

                phiObject.go("editor");

            }


            function defaultController() {

                var vm = this;

                if (phiObject.ngModel.url) {
                    phiObject.ngModel.videoId   = getYoutubeId(phiObject.ngModel.url);
                    phiObject.ngModel.isInvalid = !phiObject.ngModel.videoId;
                    phiObject.ngModel.thumbnail = phiObject.ngModel.videoId ? "http://img.youtube.com/vi/" + phiObject.ngModel.videoId + "/0.jpg" : null;
                }

            }


            editorController.$inject = ["$scope"];
            function editorController($scope) {

                var vm    = this;
                vm.save   = save;
                vm.cancel = cancel;

                $scope.$watch("phiObject.ngModel.url", function(current, previous) {

                    if (current == previous) {
                        return;
                    }

                    phiObject.ngModel.videoId   = getYoutubeId(current);
                    phiObject.ngModel.isInvalid = !!current && !phiObject.ngModel.videoId;
                    phiObject.ngModel.thumbnail = phiObject.ngModel.videoId ? "http://img.youtube.com/vi/" + phiObject.ngModel.videoId + "/0.jpg" : null;

                });

                /////////////////

                function save() {
                    phiObject.change();
                    phiObject.go("default");
                }

                function cancel() {
                    phiObject.go("default");
                }
            }

            function deleteController() {

                var vm     = this;
                vm.confirm = confirm;
                vm.cancel  = cancel;

                /////////////////

                function confirm() {
                    phiObject.destroy();
                }

                function cancel() {
                    phiObject.go("default");
                }

            }

            function getYoutubeId(url) {

                if (!url.trim().length) {
                    return null;
                }

                var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                var match  = url.match(regExp);
                if (match && match[2].length == 11) {
                    return match[2];
                } else {
                    return null;
                }
            };

        }


    }

})();