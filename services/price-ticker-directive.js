define(["require", "exports"], function (require, exports) {
    "use strict";
    class PriceTickerDirective {
        constructor($scope, $rootScope, $state, $log, $q) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$q = $q;
            console.log("PriceTickerDirective Start");
            console.log("$scope: " + $scope);
            console.log("$rootScope: " + $rootScope);
            console.log("$state: " + $state);
            console.log("$log: " + $log);
            console.log("$q: " + $q);
            console.log("PriceTickerDirective Stop");
        }
        static get fullName() {
            return "PriceTickerDirective";
        }
        static Register(module) {
            //module.service(PriceTickerDirective.fullName, ["$scope", "$rootScope", "$state", "$log", "$q", PriceTickerDirective]);
            module.service(PriceTickerDirective.fullName, []);
        }
        /**
         * SayHello
         */
        SayHello() {
            console.log("Hello");
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PriceTickerDirective;
    ;
});
//# sourceMappingURL=price-ticker-directive.js.map