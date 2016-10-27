"use strict";

import * as anguler from "angular";

import TickerController from "./tickerCtrl";
import PriceStreamSvc from "../../services/PriceStreamService";
// import PriceTickerDirective from "../../services/price-ticker-directive";

let module = angular.module("tickerModule", []);

//PriceStreamSvc.Register(module);
TickerController.Register(module);
// PriceTickerDirective.Register(module);

module.config(["$stateProvider", ($stateProvider: ng.ui.IStateProvider) => {
$stateProvider
    .state("ticker", {
        url: "",
        templateUrl: "partials/ticker/ticker.html",
        controller: TickerController,
        controllerAs: "ctrl"
    });
}]);

export default module;