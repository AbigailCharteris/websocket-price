define(["require", "exports", "./tickerCtrl"], function (require, exports, tickerCtrl_1) {
    "use strict";
    // import PriceStreamSvc from "../../services/PriceStreamService";
    // import TickerService from "./tickerService";
    let module = angular.module("tickerModule", []);
    // PriceStreamSvc.Register(module);
    // TickerService.Register(module);
    tickerCtrl_1.default.Register(module);
    // TickerService.$inject = ["$rootScope", "$state", "$log", "$http", "$q"];
    // module.service(TickerService.fullName, TickerService);
    // TickerController.$inject = ["$scope", "$rootScope", "$state", "$log", "$http", "$q", TickerService.fullName];
    // module.controller(TickerController.fullName, TickerController);
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