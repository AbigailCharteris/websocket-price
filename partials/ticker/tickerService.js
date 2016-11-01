define(["require", "exports"], function (require, exports) {
    "use strict";
    class TickerService {
        constructor($rootScope, $state, $log, $http, $q) {
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$log = $log;
            this.$http = $http;
            this.$q = $q;
            //this.$rootScope.$apply(this.price = "1.5");
            console.log(this.$rootScope);
            console.log(this.$q);
        }
        static get fullName() {
            return "TickerService";
        }
        DoSomething() {
            console.log(this.$rootScope);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TickerService;
});
//# sourceMappingURL=tickerService.js.map