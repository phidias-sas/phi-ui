(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiObjectPageBlockForm", phiObjectPageBlockForm);

    phiObjectPageBlockForm.$inject = ["phiApi"];
    function phiObjectPageBlockForm(phiApi) {

        var templateFieldPreview = '<div class="phi-form-editor-field-preview" ng-switch="field.type">' +

                                        '<div ng-switch-when="text">' +
                                            '<label ng-bind="field.title"></label>' +
                                            '<input ng-model="field.value" type="text" />' +
                                        '</div>' +

                                        '<div ng-switch-when="textarea">' +
                                            '<label ng-bind="field.title"></label>' +
                                            '<textarea ng-model="field.value"></textarea>' +
                                        '</div>' +

                                        '<div ng-switch-when="select">' +
                                            '<label ng-bind="field.title"></label>' +
                                            '<select ng-model="field.value">' +
                                                '<option value="">---</option>' +
                                                '<option ng-repeat="line in field.options | lines" value="{{line}}">{{line}}</option>' +
                                            '</select>' +
                                        '</div>' +

                                        '<div ng-switch-when="checkbox">' +
                                            '<phi-checkbox ng-model="field.value"> {{field.title}}</phi-checkbox>' +
                                        '</div>' +

                                        '<p class="description" ng-bind="field.description"></p>' +

                                    '</div>';


        var templateEditor = '<form class="phi-form-editor">' +

                                '<fieldset class="description">' +
                                    '<phi-input multiline ng-model="phiObject.form.description" label="descripci&oacute;n" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 920, \'blur\': 0 } }" ng-change="vm.save()"></phi-input>' +
                                '</fieldset>' +

                                '<fieldset class="fields" sv-root sv-part="phiObject.form.fields" sv-on-sort="vm.reorder()">' +

                                    '<div ng-repeat="field in phiObject.form.fields" sv-element class="phi-form-editor-field">' +

                                        '<div class="phi-form-editor-field-toolbar" sv-handle>' +
                                            '<a phi-icon="fa-times" ng-click="vm.removeField(field)" href="">&nbsp;</a>' +
                                        '</div>' +

                                        '<div class="phi-form-editor-field-controls">' +

                                            '<phi-select label="tipo" ng-model="field.type">' +
                                                '<phi-option value="text">texto</phi-option>' +
                                                '<phi-option value="textarea">textarea</phi-option>' +
                                                '<phi-option value="select">lista</phi-option>' +
                                                '<phi-option value="checkbox">checkbox</phi-option>' +
                                            '</phi-select>' +

                                            '<phi-input label="titulo" ng-model="field.title"></phi-input>' +

                                            '<phi-input multiline label="descripci&oacute;n" ng-model="field.description"></phi-input>' +

                                            '<div ng-show="field.type == \'select\'">' +
                                                '<phi-input multiline label="opciones" ng-model="field.options"></phi-input>' +
                                                '<p class="notice">Escribe una opci&oacute;n por l&iacute;nea</p>' +
                                            '</div>' +
                                        '</div>' +

                                        templateFieldPreview +

                                    '</div>' +

                                '</fieldset>' +

                                '<phi-button class="phi-form-editor-inserter" phi-icon-left="fa-plus" ng-click="vm.addField()">Agregar campo</phi-button>' +

                            '</form>';



        return function(phiObject) {

            return {

                initialize: initialize,

                states: {

                    default: {
                        template:   '<form>' +
                                        '<p ng-bind="phiObject.form.description"></p>' +
                                        '<fieldset>' +
                                            '<div ng-repeat="field in phiObject.form.fields">' +
                                                templateFieldPreview +
                                            '</div>' +
                                        '</fieldset>' +
                                    '</form>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: "vm",
                        template:     templateEditor
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',                    
                        template:     '<h1>Eliminar este formulario ?</h1>' + 
                                      '<phi-button class="danger" ng-click="vm.confirm()">Eliminar</phi-button>'  + 
                                      '<phi-button class="cancel" ng-click="vm.cancel()">Cancelar</phi-button>'
                    },                    

                }

            };


            function initialize() {

                if (phiObject.ngModel.url) {

                    phiApi.get(phiObject.ngModel.url)
                        .success(function(response) {
                            phiObject.form = response;
                            phiObject.go("default");
                        });

                } else {

                    phiApi.post(phiObject.ngModel.collectionUrl)
                        .success(function(response, code, headers) {
                            phiObject.ngModel.url = headers("location");
                            phiObject.form        = response;
                            phiObject.form.fields = [];
                            phiObject.change();
                            phiObject.go("editor");
                        });

                }

            };


            editorController.$inject = ["$scope", "$timeout"];
            function editorController($scope, $timeout) {

                var vm         = this;
                vm.addField    = addField;
                vm.removeField = removeField;
                vm.save        = save;
                vm.reorder     = reorder;

                //////////////////////////////////////////

                var saveTimer = null;

                $scope.$watch("phiObject.form.fields", function(current, previous) {

                    if (current == previous) {
                        return;
                    }

                    $timeout.cancel(saveTimer);
                    saveTimer = $timeout(vm.save, 1000);

                }, true);



                function addField() {

                    var newField = {
                        type: "text",
                        order: phiObject.form.fields.length
                    };

                    phiObject.form.fields.push(newField);

                };

                function removeField(field) {

                    if (confirm('Deseas eliminar este campo ?')) {
                        phiObject.form.fields.splice(phiObject.form.fields.indexOf(field), 1);
                    }

                };

                function save() {
                    phiApi.put(phiObject.ngModel.url, phiObject.form);
                };                


                function reorder() {
                    var fieldIds = [];
                    for (var cont = 1; cont <= phiObject.form.fields.length; cont++) {
                        phiObject.form.fields[cont-1].order = cont;
                    }
                };

            };


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

            };

        };

    }

})();