/*
phiStorage.session.store("name", value);
phiStorage.session.retrieve("name", defaultValue);

phiStorage.local.store("name", value);
phiStorage.local.retrieve("name", defaultValue);

*/
(function() {
    'use strict';

    angular
        .module("phi.ui")
        .factory("phiStorage", phiStorage);

    function phiStorage() {

        return {
            session: getWrapper(window.sessionStorage),
            local:   getWrapper(window.localStorage)
        };

    };

    function getWrapper(storage) {

        return {

            set: function(name, value) {
                storage[name] = angular.toJson(value);
            },

            get: function(name, defaultValue) {
                return storage[name] === undefined ? defaultValue : angular.fromJson(storage[name]);
            },

            clear: function(name) {

                if (name !== undefined) {
                    return storage.removeItem(name);
                }

                return storage.clear();
            }

        }

    };

})();