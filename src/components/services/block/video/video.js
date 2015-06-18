(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiBlockVideo", phiBlockVideo);



    phiBlockVideo.$inject = ["phiApi"];
    function phiBlockVideo(phiApi) {

        var service = {

            type:        "video",
            title:       "YouTube",
            description: "",

            initialize: initializeController,

            actions: {

                default: {

                    template:   '<div>' +
                                    '<p ng-show="!video.videoId">El v&iacute;deo no es v&aacute;lido</p>' +
                                    '<p ng-show="!!video.videoId" ng-bind="video.title"></p>' +
                                    '<iframe ng-if="!!video.videoId" width="100%" height="420" ng-src="{{\'http://www.youtube.com/embed/\' + video.videoId | trustAsResourceUrl}}" frameborder="0" allowfullscreen></iframe>' + 
                                '</div>'

                },


                create: {

                    template:   '<form>' +
                                    '<fieldset>' + 
                                        '<phi-input ng-model="video.url" label="URL de youtube"></phi-input>' +

                                        '<p ng-show="!video.videoId" class="notice">Debes ingresar una direcci&oacute;n v&aacute;lida de YouTube</p>' +

                                        '<div ng-show="!!video.videoId" class="description">' + 
                                            '<img ng-if="!!video.thumbnail" ng-src="{{video.thumbnail}}" />' +
                                            '<phi-input multiline ng-model="video.title" label="descripci&oacute;n"></phi-input>' +
                                        '</div>' + 
                                    '</fieldset>' + 

                                    '<footer>' + 
                                        '<phi-button ng-show="!!video.videoId" ng-click="vm.create()">guardar</phi-button>' +
                                        '<phi-button ng-click="vm.destroy()" class="cancel">cancelar</phi-button>' + 
                                    '</footer>' + 
                                '</form>',

                    controller:   mainController,
                    controllerAs: "vm"
                },

                modify: {

                    template:   '<form>' +
                                    '<fieldset>' + 
                                        '<phi-input ng-model="video.url" label="URL de youtube"></phi-input>' +

                                        '<p ng-show="!video.videoId" class="notice">Debes ingresar una direcci&oacute;n v&aacute;lida de YouTube</p>' +

                                        '<div ng-show="!!video.videoId" class="description">' + 
                                            '<img ng-if="!!video.thumbnail" ng-src="{{video.thumbnail}}" />' +
                                            '<phi-input multiline ng-model="video.title" label="descripci&oacute;n"></phi-input>' +
                                        '</div>' + 
                                    '</fieldset>' + 

                                    '<footer>' + 
                                        '<phi-button ng-show="!!video.videoId" ng-click="vm.save()">guardar</phi-button>' +
                                        '<phi-button ng-click="vm.cancel()" class="cancel">cancelar</phi-button>' + 
                                    '</footer>' + 
                                '</form>',

                    controller:   mainController,
                    controllerAs: "vm"
                },

                remove: {

                    template:   '<form>' + 
                                    '<h1>Eliminar este video ?</h1>' +
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
                        $scope.video = response;
                    });

            } else {

                $scope.video = {
                    id:        null,
                    source:    "YouTube",
                    title:     null,
                    url:       null,
                    videoId:   null,
                    thumbnail: null,
                    isInvalid: false
                };

                phiBlockController.openAction("create");

            }


            $scope.$watch("video.url", function(current, previous) {

                if (current == previous) {
                    return;
                }

                $scope.video.videoId   = getYoutubeId(current);
                $scope.video.isInvalid = !!current && !$scope.video.videoId;
                $scope.video.thumbnail = $scope.video.videoId ? "http://img.youtube.com/vi/" + $scope.video.videoId + "/0.jpg" : null;

            });


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


        };

        mainController.$inject = ["$scope", "phiBlockController"];
        function mainController($scope, phiBlockController) {

            var vm     = this;
            vm.cancel  = cancel;
            vm.create  = create;
            vm.save    = save;
            vm.remove  = remove;
            vm.destroy = destroy;

            function cancel() {
                phiBlockController.openAction("default");
            }

            function create() {

                if (!$scope.ngModel.endpoint) {
                    //well, that was not configured properly
                    return;
                }

                phiApi.post($scope.ngModel.endpoint, $scope.video)
                    .success(function(response, code, headers) {
                        $scope.ngModel.url = headers("location");
                        phiBlockController.openAction("default");
                        phiBlockController.create();
                    });

            }

            function save() {

                phiApi.put($scope.ngModel.url, $scope.video)
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