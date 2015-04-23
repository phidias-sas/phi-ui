(function() {
    'use strict';

    angular
        .module('phi.ui')
        .run(run);

    run.$inject = ["$rootScope", "$location"];
    function run($rootScope, $location) {
        $rootScope.$location = $location;
    }

})();
