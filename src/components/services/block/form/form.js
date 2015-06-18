(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiBlockForm", phiBlockForm);


    phiBlockForm.$inject = ["phiApi"];
    function phiBlockForm(phiApi) {

        var formTemplate = '<form class="builder">' +
                                '<fieldset>' + 
                                    '<phi-input ng-model="form.name" label="t&iacute;tulo"></phi-input>' + 
                                    '<phi-input multiline ng-model="form.description" label="descripci&oacute;n"></phi-input>' + 
                                '</fieldset>' + 

                                '<fieldset class="fields" data-as-sortable="{containment: \'.fields\'}" ng-model="form.fields">' + 

                                    '<div ng-repeat="field in form.fields" data-as-sortable-item class="field">' + 

                                        '<div class="toolbar" data-as-sortable-item-handle>' + 
                                            '<a phi-icon="fa-times" ng-click="vm.removeField(field)" href="">&nbsp;</a>' + 
                                        '</div>' + 

                                        '<div class="rendered" ng-switch="field.type">' + 

                                            '<div ng-switch-when="text">' + 
                                                '<phi-input label="{{field.title}}"></phi-input>' + 
                                            '</div>' + 

                                            '<div ng-switch-when="textarea">' + 
                                                '<phi-input multiline label="{{field.title}}"></phi-input>' + 
                                            '</div>' + 

                                            '<div ng-switch-when="select">' + 
                                                '<label ng-bind="field.title"></label>' + 
                                                '<select>' + 
                                                    '<option value="">---</option>' + 
                                                    '<option ng-repeat="line in field.options | lines" value="{{line}}">{{line}}</option>' + 
                                                '</select>' + 
                                            '</div>' + 

                                            '<div ng-switch-when="checkbox">' + 
                                                '<input type="checkbox">{{field.title}}</input>' + 
                                            '</div>' + 

                                            '<p class="notice" ng-bind="field.description"></p>' + 

                                        '</div>' + 

                                        '<div class="controls">' + 
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

                                    '</div>' + 

                                    '<button class="field-adder" phi-icon-left="fa-plus" ng-click="vm.addField()">Agregar campo</button>' + 

                                '</fieldset>' + 

                                '<footer>' + 
                                    '<phi-button ng-click="vm.save()">guardar</phi-button>' + 
                                    '<phi-button class="cancel" ng-click="vm.cancel()">cancelar</phi-button>' + 
                                '</footer>' + 
                            '</form>';



        var service = {

            type:        "form",
            title:       "Formulario",
            description: "",

            initialize: initializeController,

            actions: {

                default: {

                    template:   '<form class="face">' +

                                    '<h1 ng-bind="form.name"></h1>' + 
                                    '<p ng-bind="form.description"></p>' + 

                                    '<fieldset class="fields">' + 

                                        '<div class="rendered" ng-repeat="field in form.fields">' + 

                                            '<div ng-switch="field.type">' + 

                                                '<div ng-switch-when="text">' + 
                                                    '<phi-input label="{{field.title}}"></phi-input>' + 
                                                '</div>' + 

                                                '<div ng-switch-when="textarea">' + 
                                                    '<phi-input multiline label="{{field.title}}"></phi-input>' + 
                                                '</div>' + 

                                                '<div ng-switch-when="select">' + 
                                                    '<label ng-bind="field.title"></label>' + 
                                                    '<select>' + 
                                                        '<option value="">---</option>' + 
                                                        '<option ng-repeat="line in field.options | lines" value="{{line}}">{{line}}</option>' + 
                                                    '</select>' + 
                                                '</div>' + 

                                                '<div ng-switch-when="checkbox">' + 
                                                    '<input type="checkbox">{{field.title}}</input>' + 
                                                '</div>' + 

                                                '<p class="notice" ng-bind="field.description"></p>' + 

                                            '</div>' + 

                                        '</div>' + 

                                    '</fieldset>' + 

                                '</form>',

                    controller: mainController

                },


                create: {

                    template:     formTemplate,
                    controller:   mainController,
                    controllerAs: "vm"
                },

                modify: {

                    template:     formTemplate,
                    controller:   mainController,
                    controllerAs: "vm"
                },

                remove: {

                    template:   '<div>' + 
                                    '<h3>Eliminar este formulario ?</h3>' +  
                                    '<button ng-click="vm.doDelete()">eliminar</button>' + 
                                    '<button ng-click="vm.cancel()">cancelar</button>' + 
                                '</div>',

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
                        $scope.form = response;
                    });

            } else {

                $scope.form = {
                    id: null,
                    fields: []
                };

                phiBlockController.openAction("create");

            }

        };


        mainController.$inject = ["$scope", "phiBlockController"];
        function mainController($scope, phiBlockController) {

            var vm = this;

            vm.addField    = addField;
            vm.removeField = removeField;

            vm.save     = save;
            vm.destroy  = destroy;
            vm.doDelete = doDelete;
            vm.cancel   = cancel;

            //////////////

            function addField() {
                $scope.form.fields.push({
                    type: "text"
                });
            };

            function removeField(field) {
                if (confirm('Deseas eliminar este campo ?')) {
                    $scope.form.fields.splice($scope.form.fields.indexOf(field), 1)
                }
            };


            function save() {

                if (!$scope.ngModel.url) {

                    if (!$scope.ngModel.endpoint) {
                        //well, that was not configured properly
                        return;
                    }

                    phiApi.post($scope.ngModel.endpoint, $scope.form)
                        .success(function(response, code, headers) {
                            $scope.ngModel.url = headers("location");
                            phiBlockController.openAction("default");
                            phiBlockController.create();
                        });


                } else {

                    phiApi.put($scope.ngModel.url, $scope.form)
                        .success(function(response, code, headers) {
                            phiBlockController.openAction("default");
                        });

                }


            };

            function destroy() {
                phiBlockController.destroy();
            };

            function doDelete() {
                phiApi.remove($scope.ngModel.url)
                    .success(function(response, code, headers) {
                        vm.destroy();
                    });
            };

            function cancel() {

                if (!$scope.ngModel.url) {
                    vm.destroy();
                } else {
                    phiBlockController.openAction("default");
                }

            };

        };

    }

})();