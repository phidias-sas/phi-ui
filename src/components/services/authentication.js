(function() {
    'use strict';

    // factory
    angular
        .module('phi.ui')
        .factory('phiAuthentication', phiAuthentication);


    phiAuthentication.$inject = ["phiApi", "phiToken", "phiStorage"];

    function phiAuthentication(phiApi, phiToken, phiStorage) {

        var service = {

            token:          null,
            credentials:    null,
            isResolved:     false,

            setToken:       setToken,
            setCredentials: setCredentials,
            login:          login,
            logout:         logout,

            signup:         signup

        };

        activate();

        return service;


        //////////////////

        function activate() {
            // Look for stored data
            var storedToken = phiStorage.session.get("phiAuthentication.token");
            if (storedToken) {
                service.setToken(storedToken);
            }            
        };

        function setToken(token) {

            var payload = phiToken.decode(token);
            if (!payload) {
                return;
            }

            service.token = token;
            service.setCredentials(payload);

            phiApi.setToken(token);
            phiStorage.session.set("phiAuthentication.token", token);
        };

        function setCredentials(credentials) {
            service.credentials = credentials;
            service.isResolved  = true;
        };

        function login(username, password) {

            return phiApi.post("oauth/token", "grant_type=client_credentials",
                    {
                        headers: {
                            "Authorization": "Basic " + btoa(username + ":" + password),
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                )

                .success(function(data) {
                    service.setToken(data.access_token);
                });

        };

        function logout() {
            service.token       = null;
            service.credentials = null;
            service.isResolved  = false;

            phiApi.setToken(null);
            phiStorage.session.clear("phiAuthentication.token");
        };


        function signup(accountData) {

            return phiApi.post("accounts", accountData);

        };

    }

})();