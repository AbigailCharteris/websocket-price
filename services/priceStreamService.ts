"use strict";
import * as angular from "angular";
import * as _ from "lodash";
import { IPriceData } from "./IPriceData";


export default class PriceStreamSvc {

    // We return this object to anything injecting our service
    private Service = {};
    // Keep all pending requests here until they get responses
    private callbacks = {};
    // Create a unique callback ID to map requests to responses
    private currentCallbackId = 0;
    // Create our websocket object with the address to the websocket
    private ws: WebSocket;

    private prices: string[] = [];

    public defer: ng.IDeferred<{}>;

    public static get fullName(): string {
        return "PriceStreamService";
    }

    public static Register(module: ng.IModule) {
        module.service(PriceStreamSvc.fullName, ["$scope", "$rootScope", "$state", "$log", "$q", "angular.local.storage", PriceStreamSvc]);
        // module.service(this.fullName, []);
    }

    constructor(public $scope: ng.IScope, private $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService, $log: ng.ILogService,
        private $q: ng.IQService, private localStorageService: ng.local.storage.ILocalStorageService) {

        this.defer = $q.defer();

    // this.latestPrice = "1.22";
    // this.$scope.$emit(this.latestPrice);
    }

    public LoadPriceHistory(): string[] {
        // return ["1.5123", "1.5211", "1.5268", "1.5012", "1.5234"];
        let storePrices = this.localStorageService.get<string[]>("prices");
        if (storePrices === null) {
            storePrices = [];
        }

        return storePrices;
    }

    public StorePriceHistory(priceHistory: string[]): void {
        this.localStorageService.clearAll();
        this.localStorageService.set("prices", priceHistory);
    }

    public StreamPrices(): ng.IPromise<{}> {

        // return this.$q.when(<IPriceData>null);
        // Storing in a variable for clarity on what sendRequest returns
        return this.Connect();
    }

    public StopStream(): void {

        let request = { code: "8", message: "1001" };

        if (this.ws !== null && this.ws.OPEN) {
            //this.ws.close(1001);
            //this.ws.send(request);
            this.sendRequest(request);
        }
    }


    public Connect(): ng.IPromise<{}> {

        let defer = this.$q.defer();  // -- Why isn't $q being injected (we had to new up an instance)!!!
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
        }

        this.ws.onclose = (closeEvent) => {
            console.log("Client Disconnected!");
            //debounceLatestPrice(this.latestPrice);
            //this.StoreLocalPrice(this.latestPrice);
        };

        //return defer.promise;
        return this.defer.promise;
    };

    private sendRequest(request): ng.IPromise<{}> {

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

    DisplayPrice = function (data) {
        console.log(data);
    }

    public latestPrice: string;

    private listener(data): void {

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
    private getCallbackId() {
        this.currentCallbackId += 1;
        if (this.currentCallbackId > 10000) {
            this.currentCallbackId = 0;
        }
        return this.currentCallbackId;
    }

    public get getCustomers(): ng.IPromise<{}> {

        let request = { type: "get_customers" }

        // Storing in a variable for clarity on what sendRequest returns
        let promise = this.sendRequest(request);
        return promise;
    }

};  