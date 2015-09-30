(function() {

    angular
        .module("phi.ui")
        .directive("phiApiResource", phiApiResource);

    function phiApiResource() {

        return {

            restrict: "E",

            scope: {
                type: "@",
                src:  "@"
            },

            bindToController: true,
            controller:       phiApiResourceController,
            controllerAs:     "vm",

            template: '<div>could not load {{vm.type}} {{vm.src}}</div>'
        };


        phiApiResourceController.$inject = ["$element", "$compile", "$scope", "$injector"];
        function phiApiResourceController($element, $compile, $scope, $injector) {

            var expectedDirectiveName = "phiApiResource" + this.type.charAt(0).toUpperCase() + this.type.slice(1).toLowerCase() + 'Directive';

            if ($injector.has(expectedDirectiveName) ) {
                var e = $compile('<phi-api-resource-' + this.type + ' src="{{vm.src}}"></phi-api-resource-' + this.type + '>')($scope);
                $element.empty().append(e);
            }

        };


    };


})();