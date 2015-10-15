/*
This element provides an interface with a phidias filesystem endpoint
(see phidias/filesystem.api)

<phi-api-filesystem url="http://valid/phidias/filesystem/"></phi-api-filesystem>

*/


(function() {
    'use strict';

    angular
        .module("phi.ui")
        .directive("phiApiFilesystem", phiApiFilesystem);


    phiApiFilesystem.$inject = ["phiApi", "FileUploader"];
    function phiApiFilesystem(phiApi, FileUploader) {

        return {

            restrict: "E",

            scope: {
                "url":      "@",
                "onSelect": "&",
                "onChange": "&"
            },

            template:   '<div ng-if="uploader">' +

                            '<ul>' +
                                '<li ng-repeat="item in items" ng-class="{selected: selected.url == item.url}" ng-click="select(item)">' +
                                    '<div class="thumbnail">' +
                                        '<img ng-src="{{item.thumbnail}}" />' +
                                    '</div>' +
                                    '<p ng-bind="item.basename"></p>' +
                                    '<a class="delete" ng-click="delete(item, $event)" phi-icon="fa-times"></a>' +
                                '</li>' +

                                '<li ng-repeat="item in uploader.queue">' +
                                    '<h3 ng-bind="item.file.name"></h3>' +
                                    '<div class="thumbnail" ng-if="item.file.type.substring(0,5) == \'image\'">' +
                                        '<div ng-thumb="{file: item._file, height: 100}"></div>' +
                                    '</div>' +
                                    '<progress max="100" value="{{item.progress}}"></progress>' +
                                    '<a class="delete" ng-click="item.remove()" phi-icon="fa-times"></a>' +
                                '</li>' +

                            '</ul>' +

                            '<div nv-file-over uploader="uploader" class="dropzone" ng-click="clickDropZone()"><div nv-file-drop uploader="uploader">arrastra o selecciona archivos</div></div>' +

                            '<input type="file" nv-file-select uploader="uploader" multiple />' +

                        '</div>',

            link: phiApiFilesystemLink
        };


        function phiApiFilesystemLink(scope, element, attributes) {

            scope.selected  = scope.ngModel;
            scope.items     = [];
            scope.uploader  = null;

            scope.reload = function() {

                return phiApi.get(scope.url)
                        .success(function (data) {
                            scope.items = data;
                        });

            };

            scope.delete = function(item, event) {

                event.stopPropagation();

                if (!confirm("Eliminar este archivo?")) {
                    return;
                }

                phiApi.delete(scope.url + "/" + item.name)
                    .success(function (data) {
                        scope.items.splice(scope.items.indexOf(item), 1);
                        scope.onChange({items: scope.items});
                    });

            };

            scope.select = function(item) {
                if (attributes.onSelect) {
                    scope.selected = item;
                    scope.onSelect({item: item});
                }
            };


            attributes.$observe("url", function(url) {

                var uploadsUrl = phiApi.host ? phiApi.host + "/" + scope.url : scope.url;

                scope.uploader = new FileUploader({url: uploadsUrl});

                scope.uploader.onAfterAddingAll = function(addedItems) {
                    scope.uploader.uploadAll();
                };

                scope.uploader.onCompleteAll = function() {
                    scope.uploader.clearQueue();
                    scope.reload().success(function() {
                        scope.onChange({items: scope.items});
                    });
                };

                scope.reload();

            });


            scope.clickDropZone = function() {
                element.find('input')[0].click();
            };


        }



    }

})();