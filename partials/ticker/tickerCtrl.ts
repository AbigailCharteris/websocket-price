"use strict";

import * as angular from "angular";
import PriceStreamSvc from "../../services/PriceStreamService";
import * as _ from "lodash";

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
        module.controller(TickerCtrl.fullName, ["$scope", "$rootScope", "$state", "$log", "$http", "$q", "angular.local.storage", TickerCtrl]);
    }

    constructor(private $scope: ng.IScope, private $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService, $log: ng.ILogService, private $http: ng.IHttpService,
        private $q: ng.IQService, private localStorageService: ng.local.storage.ILocalStorageService
        ) {
        this.priceHistory = this.LoadPriceHistory();
    }

    public StopStreaming() {
        this.ws.close();
        this.StorePriceHistory(this.price);
    }

    public GetPrices() {
        this.Connect();
    }

public ClearHistory() {
    this.localStorageService.clearAll();
    this.priceHistory = [];
}


// ####################  SERVICE CODE #######################################

    private ws: WebSocket;

    public Connect(): ng.IPromise<string> {

        let defer = this.$q.defer();
        this.ws = new WebSocket("ws://localhost:80/chat");

        this.ws.onopen = () => {
            console.log("Client Connected!");

            // Storing in a variable for clarity on what sendRequest returns
            let request = { type: "get_prices" };
            this.ws.send(JSON.stringify(request));
            return defer.promise;
        };

        this.ws.onerror = (error) => {
            console.log("error: " + error.error);
        };

        // let DelayListen = _.debounce(this.listener, 2000);  // Debounce - delay exe x milliseconds until event sequence stops/changes.
        let throttleListen = _.throttle((message) => { this.$scope.$apply(this.price = message); }, 2000); // exe every x milliseconds

        this.ws.onmessage = (message) => {
            throttleListen(JSON.parse(message.data));
        };

        this.ws.onclose = (closeEvent) => {
            console.log("Client Disconnected!");
        };

        return defer.promise;
    };

    public LoadPriceHistory(): string[] {
        // return ["1.5123", "1.5211", "1.5268", "1.5012", "1.5234"];
        let storePrices = this.localStorageService.get<string[]>("prices");
        if (storePrices === null) {
            storePrices = [];
        }

        return storePrices;
    }

    public StorePriceHistory(price: string): void {
        this.priceHistory.push(price);
        this.localStorageService.set("prices", this.priceHistory);
    }

};