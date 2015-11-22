angular.module("DevInt", [
    "ngRoute",
    "angularModalService",
    "DevInt.controllers",
    "DevInt.filters",
    "DevInt.services",
    "DevInt.directives"
])
.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
//
    "use strict";
//
    $routeProvider
    .when("/app/home", {
        templateUrl: "partials/home",
        controller: "HomeCtrl"
    })
    .when("/app/jobs", {
        templateUrl: "partials/jobs",
        controller: "JobsCtrl"
    })
    .when("/app/experience", {
        templateUrl: "partials/cv",
        controller: "CvCtrl"
    })
    .when("/login", {})
    .otherwise({
        redirectTo: "/app/home"
    });
    //
    $locationProvider.html5Mode(true);
}])
.constant("APPCONFIG", {
    version: "0.1",
    imgBase: "/img",
    imgExtension: ".png",
    fetchTimeout: 20000,
    endpoints : {
        jobs : {
            list: "/api/jobs",
            type: "GET"
        },
        user: {
            login :  "/login/local",
            type: "POST"
        },
        images : {
            list: "/api/images",
            type: "GET"
        },
        experience : {
            list : "/api/experience",
            type: "GET"
        }
    }
});