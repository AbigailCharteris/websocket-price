define(["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    class PriceStreamSvc {
        constructor($scope, $rootScope, $state, $log, $q, localStorageService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$q = $q;
            this.localStorageService = localStorageService;
            // We return this object to anything injecting our service
            this.Service = {};
            // Keep all pending requests here until they get responses
            this.callbacks = {};
            // Create a unique callback ID to map requests to responses
            this.currentCallbackId = 0;
            this.prices = [];
            this.DisplayPrice = function (data) {
                console.log(data);
            };
            this.defer = $q.defer();
            // this.latestPrice = "1.22";
            // this.$scope.$emit(this.latestPrice);
        }
        static get fullName() {
            return "PriceStreamService";
        }
        static Register(module) {
            module.service(PriceStreamSvc.fullName, ["$scope", "$rootScope", "$state", "$log", "$q", "angular.local.storage", PriceStreamSvc]);
            // module.service(this.fullName, []);
        }
        LoadPriceHistory() {
            // return ["1.5123", "1.5211", "1.5268", "1.5012", "1.5234"];
            let storePrices = this.localStorageService.get("prices");
            if (storePrices === null) {
                storePrices = [];
            }
            return storePrices;
        }
        StorePriceHistory(priceHistory) {
            this.localStorageService.clearAll();
            this.localStorageService.set("prices", priceHistory);
        }
        StreamPrices() {
            // return this.$q.when(<IPriceData>null);
            // Storing in a variable for clarity on what sendRequest returns
            return this.Connect();
        }
        StopStream() {
            let request = { code: "8", message: "1001" };
            if (this.ws !== null && this.ws.OPEN) {
                //this.ws.close(1001);
                //this.ws.send(request);
                this.sendRequest(request);
            }
        }
        Connect() {
            let defer = this.$q.defer(); // -- Why isn't $q being injected (we had to new up an instance)!!!
            this.ws = new WebSocket("ws://localhost:80/chat");
            this.ws.onopen = () => {
                console.log("Client Connected!");
                // Storing in a variable for clarity on what sendRequest returns
                let request = { type: "get_prices" };
                return this.sendRequest(request);
            };
            this.ws.onerror = (error) => {
                console.log("error: " + error.error);
                // debounceLatestPrice(this.latestPrice);
            };
            // let DelayListen = _.debounce(this.listener, 2000);  // Debounce - delay exe x milliseconds until event sequence stops/changes.
            let throttleListen = _.throttle(this.listener, 2000); // exe every x milliseconds
            this.ws.onmessage = (message) => {
                throttleListen(JSON.parse(message.data));
                // this.$scope.$apply(this.latestPrice = throttleListen(JSON.parse(message.data)));
                // get to grips with writing promises..
            };
            this.ws.onclose = (closeEvent) => {
                console.log("Client Disconnected!");
                //debounceLatestPrice(this.latestPrice);
                //this.StoreLocalPrice(this.latestPrice);
            };
            //return defer.promise;
            return this.defer.promise;
        }
        ;
        sendRequest(request) {
            // let defer = this.$q.defer();  // -- Why isn't $q being injected!!!
            //let callbackId = this.getCallbackId();
            // this.callbacks[callbackId] = {
            //     time: new Date(),
            //     cb: defer
            // };
            // request.callback_id = callbackId;
            console.log("Sending request", request);
            this.ws.send(JSON.stringify(request));
            return this.defer.promise;
        }
        listener(data) {
            // let defer = this.$q.defer();  // -- Why isn't $q being injected!!!        
            let messageObj = data;
            this.latestPrice = messageObj;
            console.log("Received data from websocket: ", messageObj);
            // this.$rootScope.$apply(this.latestPrice);
            this.defer.resolve();
            // If an object exists with callback_id in our callbacks object, resolve it
            // if (this.callbacks.hasOwnProperty(messageObj.callback_id)) {
            //     console.log(this.callbacks[messageObj.callback_id]);
            //     this.$rootScope.$apply(this.callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
            //     delete this.callbacks[messageObj.callbackID];
            // }
            //return defer.promise;
        }
        // This creates a new callback ID for a request
        getCallbackId() {
            this.currentCallbackId += 1;
            if (this.currentCallbackId > 10000) {
                this.currentCallbackId = 0;
            }
            return this.currentCallbackId;
        }
        get getCustomers() {
            let request = { type: "get_customers" };
            // Storing in a variable for clarity on what sendRequest returns
            let promise = this.sendRequest(request);
            return promise;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PriceStreamSvc;
    ;
});
//# sourceMappingURL=PriceStreamService.js.map