"use strict";

import * as angular from "angular";
import * as uiRouter from "angular-ui-router";
import * as uiRouterExtras from "angular-ui-router-extras";
import * as uiBootstrap from "angular-ui-bootstrap";

import tickerModule from "partials/ticker/TickerModule";

// let module = angular.module("bakerTechApp", ["ui.router", "ngWebSocket", tickerModule.name]);
let module = angular.module("bakerTechApp", ["ui.router", "LocalStorageModule", tickerModule.name]);

 module.config(["$locationProvider", "$stateProvider", "$urlRouterProvider",
            function ($locationProvider: ng.ILocationProvider, $stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
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

module.config(["$httpProvider", ($httpProvider: any) => {
    $httpProvider.defaults.cache = false;
}]);

module.run(["$rootScope", "$state", "$log",
($rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, $log: ng.ILogService) => {
    $rootScope.$on("$stateChangeStart", (evt: any, to: any, params: any) => {
        if (to.redirectTo) {
            $log.warn ("Document Manager URL redi rection activated. The URL you have used has been deprecated please use the new format." );
            evt.preventDefault();
            $state.go(to.redirectTo, params);
        }
    });
}]);

export default module;