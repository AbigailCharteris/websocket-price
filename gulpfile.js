// One large gulp...
var gulp = require("gulp");
var gulpUtil = require("gulp-util");
var gulpclean = require('gulp-clean');
var eslint = require('gulp-eslint');
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var useref = require("gulp-useref");
var gulpIf = require("gulp-if");
var cssnano = require("gulp-cssnano");
var imagemin = require("gulp-imagemin");
var browserSync = require('browser-sync').create();
var webserver = require('gulp-webserver');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
// ###########  Constants ###########

var paths = { 
    envconfig: "/../config/", 
    protractorconfig: "protractor.conf.js", 
    builds:  {
            'static': '../static-content/', 
            'tests': '../tests-content/', 
            npm: '../npm-content/',
            e2e: '../e2e-content'
            },
    npmFiles : 'npm/',
    excludeNodeModules : '!./node_modules/**',
    excludeTypings : "!./typings/*.ts",    
    allLocations : "**/*",
    
}; 

var urls = {
    app:{
        dev: "",
        int: "",
        uat: "",
        prod: ""
    }
}

var configs = {
    env: paths.env + "/env-config.json",
    karma: __dirname + '/../karma.conf.js'
}

var tasks = {
    help: "help",
    clean: "clean",
    builds:{
        "static" : "build-static",
        npm: "build-npm",
        full: "build",
        test: "build-tests",
        e2e: "build-e2e"
    },
    test: "test",
    "test-auto": "test-auto",
    default: "default",
    "serve-static" :  "serve-static",
    "serve-tests" : "serve-tests",
    serve : "serve",
    TSlint : "TSlint",
    lint : "lint",
    TSbuild : "tsbuild",
    e2e : "e2e",
    images : "images",
    uglify : "deployMin",
    webserver : "webserver",
    sass : "sass",
    watch : "watch",
    browserSync : "browserSync",
    partials : "partials",
    sourcemaps : "sourcemaps",
    reloadJS : "reloadJS",
    reloadHtml : "reloadHtml"

};

var files = {
    builds: {
        'static': {
        all: paths.builds.static + '*.*'
        }, 
        npm: { 
            excluded: ['! ' + paths.builds.static + 'env-config.json'],
            specific: [paths.npmFiles + '*.*']
        },
        e2e: '/e2e-content/*.js'
    },  
    entry: { 
        standard: 'app/ index.ts', 
        tests: 'app/index.test.ts',
        e2e: 'e2e/**/*.e2e.ts'
    }
}; 



//################################################

// Clean out previous build
gulp.task (tasks.clean, function ( ) { 
    var srcOptions = {read: false}; 
    var cleanOptions = {force: true}; 

    return gulp.src([paths.builds.static, 
                     //paths.builds.npm, 
                     //paths.builds.tests, 
                     //paths.builds.e2e
                     ], srcOptions).pipe (gulpclean(cleanOptions));
}); 

//################################################

// tsLint
gulp.task(tasks.TSlint, function() {
    gulp.src("source.ts")
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});

//################################################

// TS Build
gulp.task(tasks.TSbuild, function() {
    
    // use same config as the IDE
    var tsProject = ts.createProject('tsconfig.json');

//    var stream = gulp.src(paths.allLocations + '.ts')

    return gulp.src([paths.allLocations + '.ts', paths.excludeNodeModules, paths.excludeTypings])
            .pipe(sourcemaps.init())
            .pipe(tsProject()) // can manually specifi config
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.builds.static));
});

//################################################

// jsLint with ESLint
gulp.task(tasks.lint, [tasks.TSlint], function() {
    // ESLint ignores files with "node_modules" paths. 
    // So, it's best to have gulp ignore the directory as well. 
    // Also, Be sure to return the stream from the task; 
    // Otherwise, the task may end before the stream has finished. 
    return gulp.src([paths.allLocations + '.js',paths.excludeNodeModules])
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
        .pipe(eslint.failAfterError());
})

//################################################

// SASS
gulp.task(tasks.sass, function(){
  return gulp.src([paths.allLocations + '.scss', paths.excludeNodeModules])
    .pipe(sourcemaps.init())
    .pipe(sass()) // Using gulp-sass
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.builds.static))
    // .pipe(browserSync.reload({
    //   stream: true
    // }))
});

//################################################

// Partials
gulp.task(tasks.partials, function(){
  return gulp.src([paths.allLocations + '.html',paths.excludeNodeModules])
        .pipe(gulp.dest(paths.builds.static))
})

//################################################

// browser-synch

gulp.task(tasks.browserSync, [tasks.webserver] ,function() {
  browserSync.init({
    server: {
      baseDir: paths.builds.static
    },
  })
})

//################################################

// sourcemaps

gulp.task(tasks.sourcemaps, [tasks.TSbuild, tasks.sass], function() {
    gulp.src(paths.allLocations + ".map")
        //.pipe(plugin())
        .pipe(gulp.dest(paths.builds.static))
        .pipe(browserSync.reload({
            stream: true
        }))
});



//################################################

// Watches

// gulp.task(tasks.watch, [tasks.browserSync, tasks.sass], function (){
gulp.task(tasks.watch, [tasks.browserSync], function (){
  gulp.watch([paths.allLocations + '.scss',paths.excludeNodeModules], [tasks.sourcemaps]); // scss changes
  gulp.watch([paths.allLocations + '.ts',paths.excludeNodeModules],[tasks.sourcemaps]); // typescript change    
  // Reloads the browser whenever HTML or JS files change
//   gulp.watch([paths.allLocations + '.html',paths.excludeNodeModules], browserSync.reload); // html changes  -----------> these might need changing to point to tasks.uglify
//   gulp.watch([paths.allLocations + '.js',paths.excludeNodeModules], browserSync.reload); // JavaScript changes -----------> these might need changing to point to tasks.uglify
  gulp.watch([paths.allLocations + '.html',paths.excludeNodeModules], [tasks.reloadHtml]); // html changes
  gulp.watch([paths.allLocations + '.js',paths.excludeNodeModules], [tasks.reloadJS]); // JavaScript changes
});



//################################################

// reload JS for browserSync

gulp.task(tasks.reloadJS, function() {
    gulp.src(paths.allLocations + '.js')
        .pipe(gulp.dest(paths.builds.static))
        .pipe(browserSync.reload({
            stream: true
        }))
});

//################################################

// reload html for browserSync

gulp.task(tasks.reloadHtml, function() {
    gulp.src(paths.allLocations + '.html')
        .pipe(gulp.dest(paths.builds.static))
        .pipe(browserSync.reload({
            stream: true
        }))
});

//################################################

// start server

gulp.task(tasks.webserver, function() {
  gulp.src(paths.builds.static)
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: "http://localhost:8000/index.html",
    }));
});

//################################################

// useref js/css and uglify

gulp.task(tasks.uglify, function(){
  return gulp.src([paths.allLocations + '.html',paths.excludeNodeModules])
    .pipe(useref())    
    .pipe(gulpIf('*.js', uglify())) // Minifies only if it's a JavaScript file    
    .pipe(gulpIf('*.css', cssnano())) // Minifies only if it's a CSS file
    .pipe(gulp.dest(paths.builds.static))
});

//################################################

// images

gulp.task(tasks.images, function(){
  return gulp.src([paths.allLocations + '.+(png|jpg|jpeg|gif|svg)',paths.excludeNodeModules])
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest(paths.builds.static))
});

//################################################

// Build
// gulp.task(tasks.builds.full, [tasks.clean, tasks.sass, tasks.uglify, tasks.images, ], function (){
//     gulpUtil.log (gulpUtil.colors.green(' === BUILD STARTED: ==='));  
// })

gulp.task(tasks.builds.full, function (callback) {
    gulpUtil.log (gulpUtil.colors.green(' === BUILD STARTED: ==='));
    runSequence(tasks.clean, [tasks.sourcemaps, tasks.uglify, tasks.images], callback);
})

gulp.task('default', function (callback) {
    gulpUtil.log (gulpUtil.colors.green(' === BUILD STARTED: ==='));
    runSequence([tasks.sourcemaps, tasks.browserSync, tasks.watch],callback);
})

// tests
// prod deployMin without source maps