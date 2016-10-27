"use strict";

export default class PriceTickerDirective {

    public static get fullName(): string {
        return "PriceTickerDirective";
    }

    public static Register(module: ng.IModule) {
        //module.service(PriceTickerDirective.fullName, ["$scope", "$rootScope", "$state", "$log", "$q", PriceTickerDirective]);
        module.service(PriceTickerDirective.fullName, []);
        
    }

    constructor(public $scope: ng.IScope, private $rootScope: ng.IRootScopeService,
                private $state: ng.ui.IStateService, $log: ng.ILogService,
                private $q: ng.IQService) {

            console.log("PriceTickerDirective Start");
            console.log("$scope: " + $scope);
            console.log("$rootScope: " + $rootScope);
            console.log("$state: " + $state);
            console.log("$log: " + $log);
            console.log("$q: " + $q);
            console.log("PriceTickerDirective Stop");

    }

    /**
     * SayHello
     */
    public SayHello() {
        console.log("Hello");
    }

};  