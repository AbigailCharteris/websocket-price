define(["require", "exports", "./tickerCtrl"], function (require, exports, tickerCtrl_1) {
    "use strict";
    // import PriceTickerDirective from "../../services/price-ticker-directive";
    let module = angular.module("tickerModule", []);
    //PriceStreamSvc.Register(module);
    tickerCtrl_1.default.Register(module);
    // PriceTickerDirective.Register(module);
    module.config(["$stateProvider", ($stateProvider) => {
            $stateProvider
                .state("ticker", {
                url: "",
                templateUrl: "partials/ticker/ticker.html",
                controller: tickerCtrl_1.default,
                controllerAs: "ctrl"
            });
        }]);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = module;
});
//# sourceMappingURL=TickerModule.js.map