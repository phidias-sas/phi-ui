(function() {
    'use strict';

    angular
        .module("phi.ui")
        .directive("phiApiFolder", phiApiFolder);


    phiApiFolder.$inject = ["phiApi", "FileUploader"];
    function phiApiFolder(phiApi, FileUploader) {

        return {

            restrict: "E",

            scope: {
                "url":      "@",
                "onSelect": "&"
            },

            template:   '<div class="phi-api-folder" ng-if="uploader">' +
                            '<ul>' +
                                '<li ng-repeat="item in items" ng-class="{selected: selected.url == item.url}" ng-click="select(item)">' +
                                    '<div class="thumbnail">' +
                                        '<img ng-src="{{item.thumbnail}}" />' +
                                    '</div>' +
                                    '<a class="delete" ng-click="delete(item, $event)" phi-icon="fa-times"></a>' +
                                '</li>' +
                                '<li ng-repeat="item in uploader.queue">' +
                                    '<div class="thumbnail">' +
                                        '<div ng-thumb="{file: item._file, height: 100}"></div>' +
                                    '</div>' +
                                    '<progress max="100" value="{{item.progress}}"></progress>' +
                                    '<a class="delete" ng-click="item.remove()" phi-icon="fa-times"></a>' +
                                '</li>' +
                            '</ul>' +
                            '<div nv-file-over uploader="uploader" class="dropzone" ng-click="clickDropZone()"><div nv-file-drop uploader="uploader">arrastra o selecciona archivos</div></div>' +
                            '<input type="file" nv-file-select uploader="uploader" multiple />' +
                        '</div>',

            link: phiApiFolderLink
        };


        function phiApiFolderLink(scope, element, attributes) {

            scope.selected  = scope.ngModel;
            scope.items     = [];
            scope.uploader  = null;

            scope.reload = function() {

                phiApi.get(scope.url)
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
                    });

            };

            scope.select = function(item) {
                if (attributes.onSelect) {
                    scope.selected = item;
                    scope.onSelect({item: item});
                }
            };


            attributes.$observe("url", function(url) {

                scope.uploader = new FileUploader({url: "http://"+phiApi.host+"/"+scope.url});

                scope.uploader.onAfterAddingAll = function(addedItems) {
                    scope.uploader.uploadAll();
                };

                scope.uploader.onCompleteAll = function() {
                    scope.reload();
                    scope.uploader.clearQueue();
                };


                scope.reload();

            });


            scope.clickDropZone = function() {
                element.find('input')[0].click();
            };


        }



    }

})();