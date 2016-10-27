define(["require", "exports", "angular", "partials/ticker/TickerModule"], function (require, exports, angular, TickerModule_1) {
    "use strict";
    // let module = angular.module("bakerTechApp", ["ui.router", "ngWebSocket", tickerModule.name]);
    let module = angular.module("bakerTechApp", ["ui.router", "LocalStorageModule", TickerModule_1.default.name]);
    module.config(["$locationProvider", "$stateProvider", "$urlRouterProvider",
        function ($locationProvider, $stateProvider, $urlRouterProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            $stateProvider
                .state({
                name: "home",
                url: "/",
            });
            $urlRouterProvider.otherwise("/");
        }]);
    module.config(["$httpProvider", ($httpProvider) => {
            $httpProvider.defaults.cache = false;
        }]);
    module.run(["$rootScope", "$state", "$log",
            ($rootScope, $state, $log) => {
            $rootScope.$on("$stateChangeStart", (evt, to, params) => {
                if (to.redirectTo) {
                    $log.warn("Document Manager URL redi rection activated. The URL you have used has been deprecated please use the new format.");
                    evt.preventDefault();
                    $state.go(to.redirectTo, params);
                }
            });
        }]);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = module;
});
//# sourceMappingURL=AppModule.js.map