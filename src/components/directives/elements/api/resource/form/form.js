(function() {
    'use strict';

    angular
        .module("phi.ui")
        .directive("phiApiResourceForm", phiApiResourceForm);


    function phiApiResourceForm() {

        return {

            restrict: "E",

            scope: {
                src: "@"
            },

            bindToController: true,

            controller:       phiApiResourceFormController,
            controllerAs:     "vm",

            template:   '<form ng-if="!!vm.entity && !vm.records.length">' + 
                            '<fieldset>' +

                                '<div ng-repeat="field in vm.entity.fields" ng-switch="field.type" class="phi-api-resource-form-field">' +

                                    '<div ng-switch-when="text">' +
                                        '<label ng-bind="field.title"></label>' +
                                        '<input ng-model="vm.currentRecord[field.name]" type="text" />' +
                                    '</div>' +

                                    '<div ng-switch-when="textarea">' +
                                        '<label ng-bind="field.title"></label>' +
                                        '<textarea ng-model="vm.currentRecord[field.name]"></textarea>' +
                                    '</div>' +

                                    '<div ng-switch-when="select">' +
                                        '<label ng-bind="field.title"></label>' +
                                        '<select ng-model="vm.currentRecord[field.name]">' +
                                            '<option value="">---</option>' +
                                            '<option ng-repeat="line in field.options | lines" value="{{line}}">{{line}}</option>' +
                                        '</select>' +
                                    '</div>' +

                                    '<div ng-switch-when="checkbox">' +
                                        '<input type="checkbox" ng-model="vm.currentRecord[field.name]">{{field.title}}</input>' +
                                    '</div>' +

                                    '<p ng-bind="field.description"></p>' +

                                '</div>' + 

                            '</fieldset>' +

                            '<footer>' + 
                                '<phi-button ng-click="vm.saveCurrentRecord()">Enviar</phi-button>' +
                            '</footer>' + 

                        '</form>' + 

                        '<div ng-if="!!vm.records.length">' + 
                            '<fieldset ng-repeat="record in vm.records">' +
                                '<div ng-repeat="field in vm.entity.fields">' +
                                    '<strong ng-bind="field.title"></strong>: <span ng-bind="record.values[field.name]"></span>' +
                                '</div>' +
                            '</fieldset>' +
                        '</div>'
        };


        phiApiResourceFormController.$inject = ["phiApi", "phiToken"];
        function phiApiResourceFormController(phiApi, phiToken) {

            var vm               = this;
            vm.entity            = null;
            vm.records           = null;
            vm.currentRecord     = {};
            vm.saveCurrentRecord = saveCurrentRecord;

            // Determine the current user, and the records URL
            var credentials = phiToken.decode(phiApi.token);
            var recordsUrl  = null;

            phiApi.get(vm.src)
                .success(function(response) {
                    vm.entity = response;

                    // Fetch records
                    if (credentials) {

                        recordsUrl = 'people/' + credentials.person + '/data/entities/' + vm.entity.id + '/records';

                        phiApi.get(recordsUrl)
                            .success(function(records) {
                                vm.records = records;
                            });

                    }

                });

            ///////////////////////////////

            function saveCurrentRecord() {

                if (!recordsUrl) {
                    return;
                }

                phiApi.post(recordsUrl, vm.currentRecord)
                    .success(function(response, code, headers) {
                        vm.records       = [response];
                        vm.currentRecord = {};
                    });

            }

        };


    };


})();