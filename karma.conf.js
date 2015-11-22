// Karma configuration
// Generated on Sun Nov 01 2015 13:34:09 GMT+0000 (GMT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'public/bower_components/angular/angular.js',
        'public/bower_components/angular-route/angular-route.js',
        'public/bower_components/angular-mocks/angular-mocks.js',
        'public/bower_components/angular-modal-service/dst/angular-modal-service.min.js',
        'public/dist/js/*.js',
        'spec/unit/*.js'
    ],
/*
    files: [
        'public/bower_components/lodash/lodash.min.js',
        'public/bower_components/angular/angular.js',
        'public/bower_components/angular-route/angular-route.min.js',
        'public/bower_components/angular-mocks/angular-mocks.js',
        "public/bower_components/angular-animate/angular-animate.js",
        "public/bower_components/angular-notify/dist/angular-notify.min.js",
        "public/bower_components/angular-modal-service/dst/angular-modal-service.min.js",
        'public/dist/lucky13menu.js',
        'spec/*.js'
    ],
*/

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
