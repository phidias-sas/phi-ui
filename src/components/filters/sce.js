(function() {
    'use strict';

    angular
        .module('phi.ui')
        .filter('trustAsResourceUrl', trustAsResourceUrl);

    trustAsResourceUrl.$inject = ["$sce"];
    function trustAsResourceUrl($sce) {
        return $sce.trustAsResourceUrl;
    }

})();