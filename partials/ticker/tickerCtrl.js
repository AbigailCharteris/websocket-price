define(["require", "exports", "../../services/PriceStreamService"], function (require, exports, PriceStreamService_1) {
    "use strict";
    // import PriceTickerDirective from "../../services/price-ticker-directive";
    class TickerCtrl {
        //    constructor(private $scope: ng.IScope, $log: ng.ILogService, priceStreamService: PriceStreamService) {  // --> can't inject PriceStreamService!??!!
        constructor($scope, $rootScope, $state, $log, $http, $q, localStorageService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$http = $http;
            this.$q = $q;
            this.localStorageService = localStorageService;
            //this.priceStreamingService = new PriceStreamSvc($scope, $rootScope, $state, $log, $q, localStorageService);
            this.StreamPrices("1").then(response => {
                console.log(response);
            });
            this.StreamPricesChain("2").then(response => {
                console.log(response);
            });
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
        // public StopStreaming() {
        //     this.priceHistory.push(this.price);
        //     this.priceStreamingService.StopStream();
        //     this.priceStreamingService.StorePriceHistory(this.priceHistory);
        // }
        StreamPrices(id) {
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