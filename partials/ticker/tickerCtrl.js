define(["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    // import PriceTickerDirective from "../../services/price-ticker-directive";
    // import TickerService from "./tickerService";
    // let localStorageService: ng.local.storage.ILocalStorageService = require("LocalStorageModule");
    class TickerCtrl {
        //    constructor(private $scope: ng.IScope, $log: ng.ILogService, priceStreamService: PriceStreamService) {  // --> can't inject PriceStreamService!??!!
        constructor($scope, $rootScope, $state, $log, $http, $q, localStorageService) {
            //    , private priceStreamService: PriceStreamSvc) {
            //this.localStorageService = localStorage;
            // console.log("Ticker Service: " + this.tickerService);
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$http = $http;
            this.$q = $q;
            this.localStorageService = localStorageService;
            // console.log("localStorage: " + this.localStorageService);
            // this.priceStreamingService = new PriceStreamSvc($scope, $rootScope, $state, $log, $q, localStorageService);
            // this.StreamPrices("1").then(response => {
            //     console.log(response);
            // });
            // this.StreamPricesChain("2").then(response => {
            //     console.log(response);
            // })
            // this.Connect()
            //     .then( response => {
            //         this.price = response;
            //         this.price = "1.4";
            //     });
            this.priceHistory = this.LoadPriceHistory();
            // this.tickerService.DoSomething();
        }
        static get fullName() {
            return "TickerCtrl";
        }
        //private localStorageService: ng.local.storage.ILocalStorageService;
        get DisplayMsg() {
            return this.msg;
        }
        ;
        static Register(module) {
            //        module.controller(TickerCtrl.fullName, ["$scope", "$rootScope", "$state", "$log", "$http", "$q", "angular.local.storage", PriceStreamSvc.fullName, TickerCtrl]);
            module.controller(TickerCtrl.fullName, ["$scope", "$rootScope", "$state", "$log", "$http", "$q", "angular.local.storage", TickerCtrl]);
            //        module.controller(TickerCtrl.fullName, ["$scope", "$rootScope", "$state", "$log", "$http", "$q", "angular.local.storage", TickerService.fullName, TickerCtrl]);
            //module.controller(TickerCtrl.fullName, []);
        }
        // public GetPrices() {
        //     this.price = this.priceStreamingService.latestPrice;
        //     this.priceStreamingService.StreamPrices()
        //         .then(data => {
        //             this.price = String(data);
        //             this.price = this.priceStreamingService.latestPrice;
        //         });
        //     //this.$scope.$on(this.priceStreamingService.latestPrice, (data) => {this.price = String(data); });
        // }
        StopStreaming() {
            this.ws.close();
            this.StorePriceHistory(this.price);
            // this.priceHistory.push(this.price);
            // this.priceStreamingService.StopStream();
            // this.priceStreamingService.StorePriceHistory(this.priceHistory);
        }
        GetPrices() {
            this.Connect();
        }
        ClearHistory() {
            //this.localStorageService.clearAll();
            this.localStorageService.clearAll();
            this.priceHistory = [];
        }
        Connect() {
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
                // debounceLatestPrice(this.latestPrice);
            };
            // let DelayListen = _.debounce(this.listener, 2000);  // Debounce - delay exe x milliseconds until event sequence stops/changes.
            // let throttleListen = _.throttle(this.listener, 2000); // exe every x milliseconds
            let throttleListen = _.throttle((message) => { this.$scope.$apply(this.price = message); }, 2000); // exe every x milliseconds
            this.ws.onmessage = (message) => {
                // throttleListen(defer, this.$rootScope, JSON.parse(message.data));
                throttleListen(JSON.parse(message.data));
            };
            this.ws.onclose = (closeEvent) => {
                console.log("Client Disconnected!");
                //this.StoreLocalPrice(this.latestPrice);
            };
            return defer.promise;
        }
        ;
        LoadPriceHistory() {
            // return ["1.5123", "1.5211", "1.5268", "1.5012", "1.5234"];
            let storePrices = this.localStorageService.get("prices");
            if (storePrices === null) {
                storePrices = [];
            }
            return storePrices;
        }
        // public StorePriceHistory(priceHistory: string[]): void {
        StorePriceHistory(price) {
            this.priceHistory.push(price);
            this.localStorageService.set("prices", this.priceHistory);
        }
        // ##############  PROMISE EXAMPLES ######################
        StreamPricesSingle(id) {
            let defer = this.$q.defer();
            let uri = "http://localhost:51633/api/products";
            let promise = this.$http.get(uri + "/" + id);
            promise.success(response => {
                defer.resolve({ response });
            });
            promise.error(error => {
                defer.reject(error);
            });
            return defer.promise;
        }
        StreamPricesChain(id) {
            let q = this.$q.defer();
            let uri = "http://localhost:51633/api/products";
            this.$http.get(uri + "/" + id)
                .then((response) => {
                return { data: response.data };
            }, (httpError) => {
                // translate the error
                throw httpError.status + " : " + httpError.data;
            });
            return q.promise;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TickerCtrl;
    ;
});
//# sourceMappingURL=tickerCtrl.js.map