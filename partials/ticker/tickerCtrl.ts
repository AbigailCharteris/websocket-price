"use strict";

import * as angular from "angular";
import PriceStreamSvc from "../../services/PriceStreamService";
// import PriceTickerDirective from "../../services/price-ticker-directive";

export default class TickerCtrl {

    static get fullName(): string {
        return "TickerCtrl";
    }
    private myVar: string;
    public msg: string;

    public price: string;
    public priceHistory: string[];
    public expiry: string;
    public priceStreamingService: PriceStreamSvc;

    public get DisplayMsg(): string {
        return this.msg;
    };

    static Register(module: ng.IModule) {
        module.controller(TickerCtrl.fullName, ["$scope", "$rootScope", "$state", "$log", "$http", "$q", "angular.local.storage", PriceStreamSvc.fullName, TickerCtrl]);
        //module.controller(TickerCtrl.fullName, []);
    }

    //    constructor(private $scope: ng.IScope, $log: ng.ILogService, priceStreamService: PriceStreamService) {  // --> can't inject PriceStreamService!??!!
    constructor(public $scope: ng.IScope, private $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService, $log: ng.ILogService, private $http: ng.IHttpService,
        private $q: ng.IQService, private localStorageService: ng.local.storage.ILocalStorageService) {//, private priceStreamService: PriceStreamSvc) {


        //this.priceStreamingService = new PriceStreamSvc($scope, $rootScope, $state, $log, $q, localStorageService);
        this.StreamPrices("1").then(response => {
            console.log(response);
        });

        this.StreamPricesChain("2").then(response => {
            console.log(response);
        })
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

    public StreamPrices(id: string): ng.IPromise<{}> {

        let defer = this.$q.defer();
        let uri = "http://localhost:51633/api/products";

        let promise = this.$http.get(uri + "/" + id);

        promise.success(response =>{
            defer.resolve({response});
        });

        promise.error(error => {
            defer.reject(error);
        });

        return defer.promise;
    }

    public StreamPricesChain(id: string): ng.IHttpPromise<{}> {

        let q = this.$q.defer();
        let uri = "http://localhost:51633/api/products";

        this.$http.get(uri + "/" + id)
                  .then((response) => {
                            return { data: response.data };
                        },
                        (httpError) => {
                            // translate the error
                            throw httpError.status + " : " + httpError.data;
                        });

        return q.promise;
    }


    // handle error and transform data
    // this.getMovie = function(movie) {
    //     return $http.get('/api/v1/movies/' + movie)
    //            .then(
    //               function (response) {
    //                 return {
    //                    title: response.data.title,
    //                    cost:  response.data.price
    //                 });
    //               },
    //               function (httpError) {
    //                  // translate the error
    //                  throw httpError.status + " : " + 
    //                        httpError.data;
    //               });
    // };

    // Chained promises for multiple calls
    // service('asyncService', function($http, $q) {
    //     return {
    //         loadDataFromUrls: function (urls) {
    //             var deferred = $q.defer();
    //             var urlCalls = [];
    //             angular.forEach(urls, function (url) {
    //                 urlCalls.push($http.get(url.url));
    //             });
    //             // they may, in fact, all be done, but this
    //             // executes the callbacks in then, once they are
    //             // completely finished.
    //             $q.all(urlCalls)
    //                 .then(
    //                 function (results) {
    //                     deferred.resolve(
    //                         JSON.stringify(results))
    //                 },
    //                 function (errors) {
    //                     deferred.reject(errors);
    //                 },
    //                 function (updates) {
    //                     deferred.update(updates);
    //                 });
    //             return deferred.promise;
    //         }
    //     };
    // });

};