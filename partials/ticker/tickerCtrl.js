define(["require", "exports", "../../services/PriceStreamService"], function (require, exports, PriceStreamService_1) {
    "use strict";
    // import PriceTickerDirective from "../../services/price-ticker-directive";
    class TickerCtrl {
        //    constructor(private $scope: ng.IScope, $log: ng.ILogService, priceStreamService: PriceStreamService) {  // --> can't inject PriceStreamService!??!!
        constructor($scope, $rootScope, $state, $log, $http, $q, localStorageService) {
            //this.priceStreamingService = new PriceStreamSvc($scope, $rootScope, $state, $log, $q, localStorageService);
            // this.StreamPrices("1").then(response => {
            //     console.log(response);
            // });
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$http = $http;
            this.$q = $q;
            this.localStorageService = localStorageService;
            // this.StreamPricesChain("2").then(response => {
            //     console.log(response);
            // })
            // this.Connect()
            //     .then( response => {
            //         this.price = response;
            //         this.price = "1.4";
            //     });
        }
        static get fullName() {
            return "TickerCtrl";
        }
        get DisplayMsg() {
            return this.msg;
        }
        ;
        static Register(module) {
            module.controller(TickerCtrl.fullName, ["$scope", "$rootScope", "$state", "$log", "$http", "$q", "angular.local.storage", PriceStreamService_1.default.fullName, TickerCtrl]);
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
            // this.priceHistory.push(this.price);
            // this.priceStreamingService.StopStream();
            // this.priceStreamingService.StorePriceHistory(this.priceHistory);
        }
        GetPrices() {
            this.Connect();
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
        // private listener(defer: ng.IDeferred<string>, scope: ng.IScope, data): void {
        //     //let defer = this.$q.defer();
        //     let messageObj = data;
        //     console.log("Received data from websocket: ", messageObj);
        //     this.price = data;
        //     scope.$apply(this.price = data);
        //     defer.resolve(data);
        // }
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