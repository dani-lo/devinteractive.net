angular.module("DevInt.filters", [])
	.filter("interpolate", ["APPCONFIG", function (APPCONFIG) {
		//
		"use strict";

		return function (text) {
			return String(text).replace(/\%VERSION\%/mg, APPCONFIG.version);
		};
	}]);