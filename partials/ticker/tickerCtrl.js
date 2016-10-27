define(["require", "exports", "../../services/PriceStreamService"], function (require, exports, PriceStreamService_1) {
    "use strict";
    // import PriceTickerDirective from "../../services/price-ticker-directive";
    class TickerCtrl {
        //    constructor(private $scope: ng.IScope, $log: ng.ILogService, priceStreamService: PriceStreamService) {  // --> can't inject PriceStreamService!??!!
        constructor($scope, $rootScope, $state, $log, $q, localStorageService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.priceStreamingService = new PriceStreamService_1.default($scope, $rootScope, $state, $log, $q, localStorageService);
        }
        static get fullName() {
            return "TickerCtrl";
        }
        get DisplayMsg() {
            return this.msg;
        }
        ;
        static Register(module) {
            module.controller(TickerCtrl.fullName, ["$scope", "$rootScope", "$state", "$log", "$q", "angular.local.storage", PriceStreamService_1.default.fullName, TickerCtrl]);
            //module.controller(TickerCtrl.fullName, []);
        }
        GetPrices() {
            this.price = this.priceStreamingService.latestPrice;
            this.priceStreamingService.StreamPrices()
                .then(data => {
                this.price = String(data);
                this.price = this.priceStreamingService.latestPrice;
            });
            //this.$scope.$on(this.priceStreamingService.latestPrice, (data) => {this.price = String(data); });
        }
        StopStreaming() {
            this.priceHistory.push(this.price);
            this.priceStreamingService.StopStream();
            this.priceStreamingService.StorePriceHistory(this.priceHistory);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TickerCtrl;
    ;
});
//# sourceMappingURL=tickerCtrl.js.map