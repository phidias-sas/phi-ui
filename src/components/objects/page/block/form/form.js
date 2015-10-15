(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiObjectPageBlockForm", phiObjectPageBlockForm);

    phiObjectPageBlockForm.$inject = ["phiApi"];
    function phiObjectPageBlockForm(phiApi) {

        var templateFieldPreview = '<div class="preview" ng-switch="field.type">' +

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
                                            '<input type="checkbox" ng-model="field.value">{{field.title}}</input>' +
                                        '</div>' +

                                        '<p class="notice" ng-bind="field.description"></p>' +

                                    '</div>';


        var templateEditor = '<form>' +
                                '<fieldset>' +
                                    '<phi-input multiline ng-model="phiObject.form.description" label="descripci&oacute;n"></phi-input>' +
                                '</fieldset>' +

                                '<fieldset class="fields" sv-root sv-part="phiObject.form.fields">' +

                                    '<div ng-repeat="field in phiObject.form.fields" sv-element class="field">' +

                                        '<div class="toolbar" sv-handle>' +
                                            '<a phi-icon="fa-times" ng-click="vm.removeField(field)" href="">&nbsp;</a>' +
                                        '</div>' +

                                        '<div class="controls">' +

                                            '<phi-select label="tipo" ng-model="field.type">' +
                                                '<phi-option value="text">texto</phi-option>' +
                                                '<phi-option value="textarea">textarea</phi-option>' +
                                                '<phi-option value="select">lista</phi-option>' +
                                                '<phi-option value="checkbox">checkbox</phi-option>' +
                                            '</phi-select>' +

                                            '<phi-input label="titulo" ng-model="field.title" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 920, \'blur\': 0 } }"></phi-input>' +

                                            '<phi-input multiline label="descripci&oacute;n" ng-model="field.description" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 920, \'blur\': 0 } }"></phi-input>' +

                                            '<div ng-show="field.type == \'select\'">' +
                                                '<phi-input multiline label="opciones" ng-model="field.options" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 920, \'blur\': 0 } }"></phi-input>' +
                                                '<p class="notice">Escribe una opci&oacute;n por l&iacute;nea</p>' +
                                            '</div>' +
                                        '</div>' +

                                        templateFieldPreview +

                                    '</div>' +

                                    '<button class="field-adder" phi-icon-left="fa-plus" ng-click="vm.addField()">Agregar campo</button>' +

                                '</fieldset>' +

                                '<footer>' +
                                    '<phi-button ng-click="vm.save()">guardar</phi-button>' +
                                '</footer>' +
                            '</form>';



        return function(phiObject) {

            return {

                initialize: initialize,

                states: {

                    default: {
                        template:   '<form>' +
                                        '<p>Vista previa del formulario:</p>' +
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
                    }

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
                            phiObject.change();
                            phiObject.go("editor");
                        });

                }

            };


            editorController.$inject = ["$scope"];
            function editorController($scope) {

                var vm         = this;
                vm.addField    = addField;
                vm.removeField = removeField;
                vm.save        = save;

                //////////////////////////////////////////

                $scope.$watch("phiObject.form.fields", function(current, previous) {

                    if (current == previous) {
                        return;
                    }

                    vm.save();

                }, true);



                function addField() {

                    var newField = {
                        type: "text"
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

            };

        };

    }

})();