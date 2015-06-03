(function() {
    'use strict';

    angular
        .module('phi.ui')
        .provider('phiApi', phiApi);

    function phiApi() {

        var provider      = this;

        provider.host     = null;
        provider.token    = null;
        provider.setHost  = setHost;
        provider.setToken = setToken;

        provider.$get     = service;

        /////////////////////////////////////////////////////

        function setHost(host) {
            provider.host = host;
        }

        function setToken(token) {
            provider.token = token;
        }

        service.$inject = ["$http"];

        function service($http) {
            
            var service = {
                get:      get,
                post:     post,
                put:      put,
                patch:    patch,
                options:  options,
                "delete": deleteFn,
                remove:   deleteFn  //alias, when phiApi.delete() causes a syntax error ("delete" is a reserved JS keyword)
            }

            return angular.extend(provider, service);

            ///////

            function get(resource, data, config) {
                return execute("get", resource, data, config);
            }

            function post(resource, data, config) {
                return execute("post", resource, data, config);
            }

            function put(resource, data, config) {
                return execute("put", resource, data, config);
            }

            function patch(resource, data, config) {
                return execute("patch", resource, data, config);
            }

            function options(resource, data, config) {
                return execute("options", resource, data, config);
            }

            function deleteFn(resource, data, config) {
                return execute("delete", resource, data, config);
            }


            function execute(method, resource, data, config) {

                var request = {
                    method: method,
                    url:    "http://" + provider.host + "/" + resource,
                    data:   data
                };

                angular.extend(request, config);

                if (provider.token) {
                    angular.extend(request, {
                        headers: {
                            Authorization: "Bearer " + provider.token
                        }
                    });
                }

                if (method == "get") {
                    request.url += "?" + serialize(data);
                    request.data = null;
                }

                return $http(request, config);

            }


            function serialize(obj, prefix) {

                var str = [];
                for(var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        var k = prefix ? prefix + "[" + p + "]" : p;
                        var v = obj[p];

                        if (v == null) {
                            continue;
                        }

                        if (typeof v == "object") {
                            str.push(serialize(v, k));
                        } else if (typeof v == "number" || v.length > 0) {
                            str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
                        }

                    }
                }

                return str.join("&");
            }


        }

    }

})();