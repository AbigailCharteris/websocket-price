"use strict";

import * as angular from "angular";
import * as _ from "lodash";

export default class TickerService {

    static get fullName(): string {
        return "TickerService";
    }

    // static Register(module: ng.IModule): void {
    //     // module.service( TickerService.fullName, ["$scope", "$rootScope", "$state", "$log", "$http", "$q", "angular.local.storage", TickerService] );
    //     module.service( TickerService.fullName, ["$state", "$log", "$http", "$q", "angular.local.storage", TickerService] );
    // }

    private price: string;

    constructor(private $rootScope: ng.IScope, private $state: ng.ui.IStateService, private $log: ng.ILogService,
                private $http: ng.IHttpProvider, private $q: ng.IQService 
                //, private localStorage: ng.local.storage.ILocalStorageServiceProvider
                ) {

                    //this.$rootScope.$apply(this.price = "1.5");
        console.log(this.$rootScope);
        console.log(this.$q);
                    
    }

    public DoSomething(){
        console.log(this.$rootScope);
    }

} 