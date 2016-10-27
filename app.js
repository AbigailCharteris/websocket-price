define(["angular", "require", "exports", "ui.router"],
     function (angular, require, exports, uiRouter) {
        "use strict";

        //Declare Main Module 
        //## DONT FORGET TO INCLUDE A DEP TO OTHER MODULES OR THE UI ROUTER WILL FAIL!!
        var module = angular.module("myApp", ["ui.router"]);

        //DetailCtrl.register(module);

        
        // Setup Routing
        module.config(["$locationProvider","$stateProvider","$urlRouterProvider",
            function ($locationProvider, $stateProvider, $urlRouterProvider) {
        //  module.config(["$locationProvider","$stickyStateProvider","$urlRouterProvider",
        //      function ($locationProvider, $stickyStateProvider, $urlRouterProvider) {
                
                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });

                $stateProvider
                .state({
                    name: "home",
                    url: "/",
                    // sticky: true  // --> maintains state hierachy tree
                    // abstract: true 
                });

                $urlRouterProvider.otherwise("/");
            }]);

        //Config Http services
        module.config(["$httpProvider", function ($httpProvider) {
            $httpProvider.defaults.cache = false;
        }]);

        //Enable state redirect
        module.run(["$rootScope", "$state", "$log",
            function ($rootScope, $state, $log) {
                $rootScope.$on(function ($stateChangeStart, evt, to, params) {
                    if (to.redirectTo) {
                        $log.warn("Invalid URL, please use the correct format.");
                        evt.preventDefault();
                        $state.go(to.redirectTo, params);
                    }
                });
            }]);

        

        //babel export syntax (not requireJS)
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = module;

/* //requireJS syntax to export module and dependencies
return{
    propertyName: function_in_module_above,
    ...
}
*/

    });
