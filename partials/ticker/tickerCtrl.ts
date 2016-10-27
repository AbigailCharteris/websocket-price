"use strict";

import * as angular from "angular";
import PriceStreamSvc from "../../services/PriceStreamService";
// import PriceTickerDirective from "../../services/price-ticker-directive";

export default class TickerCtrl {

    static get fullName(): string {
        return "TickerCtrl";
    }
    private myVar: string;
    public msg: string;

    public price: string;
    public priceHistory: string[];
    public expiry: string;
    public priceStreamingService: PriceStreamSvc;

    public get DisplayMsg(): string {
        return this.msg;
    };

    static Register(module: ng.IModule) {
        module.controller(TickerCtrl.fullName, ["$scope", "$rootScope", "$state", "$log", "$q", "angular.local.storage", PriceStreamSvc.fullName, TickerCtrl]);  
        //module.controller(TickerCtrl.fullName, []);
    }

//    constructor(private $scope: ng.IScope, $log: ng.ILogService, priceStreamService: PriceStreamService) {  // --> can't inject PriceStreamService!??!!
    constructor(public $scope: ng.IScope, private $rootScope: ng.IRootScopeService,
                private $state: ng.ui.IStateService, $log: ng.ILogService,
                private $q: ng.IQService, private localStorageService: ng.local.storage.ILocalStorageService){//, private priceStreamService: PriceStreamSvc) {


            this.priceStreamingService = new PriceStreamSvc($scope, $rootScope, $state, $log, $q, localStorageService);
    }

    public GetPrices() {

        this.price = this.priceStreamingService.latestPrice;

        this.priceStreamingService.StreamPrices()
            .then(data => {
                this.price = String(data);
                this.price = this.priceStreamingService.latestPrice;
            });

        //this.$scope.$on(this.priceStreamingService.latestPrice, (data) => {this.price = String(data); });
    }

    public StopStreaming() {
        this.priceHistory.push(this.price);
        this.priceStreamingService.StopStream();
        this.priceStreamingService.StorePriceHistory(this.priceHistory);
    }

};