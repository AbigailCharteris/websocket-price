// Define All the JS dependencies here (just like .Net Unity container!!)
// We don't need to list all the js script in the index.html file, only add the below to kickstart the app
// <script data-main="main.js" src="/node_modules/requirejs/require.js"></script>
// esLint suppression
/* 
  global 
  require
*/
require.config({
    //baseUrl: "js",  // not typically needed if you start in app root    
    paths: {
        "angular": "node_modules/angular/angular",
        "ui.router": "node_modules/angular-ui-router/release/angular-ui-router.min",
        "ui.router.extras": "node_modules/ui-router-extras/release/ct-ui-router-extras.min",
        "require": "node_modules/requirejs/require",
        "exports": "node_modules/exports/lib/exports",
        "lodash" : "node_modules/lodash/lodash",
        "angular.local.storage" : "node_modules/angular-local-storage/dist/angular-local-storage",
        "jquery" : "node_modules/jquery/dist/jquery.min",
        "ui.bootstrap" : "node_modules/bootstrap/dist/js/bootstrap.min"
    },
    /**
    * shim --> for libs that either do not support AMD out of the box, or
    * require some fine tuning for dependency mgt'
    * use the {export:"InsertIdentifer"} to allow requireJS to pick up js libs that aren't encapsulated in a define() fn eg. Lodash'
    */
    shim: {
        "angular": { exports: "angular" },  // This ensures angular is globally available 
        "ui.router": ["angular"],
        "ui.router.extras": ["angular"],
        "tickerModule": ["angular"],
        "lodash" : {exports: "_"},
        "angular.local.storage" : { deps: ["angular"] },
        "jquery" : {exports : "$"},        
        "ui.bootstrap": {dep: ["jquery"]}
        
    },
    deps: ["AppModule"],  // dependency which loads app.js
});

// DI angular, ngRoute, app.js and then bootstrap our app!
// require(["angular", "AppModule", "ui.router", "ui.bootstrap" ], function (angular, AppModule, uiRouter, uiBootstrap) {
require(["angular", "AppModule", "ui.router", "angular.local.storage"], function (angular, AppModule, uiRouter, LocalStorageModule) {
    angular.bootstrap(document, ["bakerTechApp"]
   // , { strictDi: true }
    );
});