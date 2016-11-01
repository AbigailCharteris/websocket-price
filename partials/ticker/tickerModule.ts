"use strict";

import * as anguler from "angular";
import TickerController from "./tickerCtrl";

let module = angular.module("tickerModule", []);

TickerController.Register(module);

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