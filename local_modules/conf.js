var APPCONF = {
	"dbconn": "mongodb://dani:danidev@ds045684.mongolab.com:45684/devinteractive",
	"secret": "12woKjh7343ww02_P3n22xyT9",
	"auth": {
		"github": {
			"clientID": "21abb346a3f57f99b2ad",
			"clientSecret": "45d0e764fab12fd8b98cf7ec57cf5d1e0741ffd0",
			"callbackURL": "https://devinteractive.herokuapp.com/auth/callback"
		}
	},
	"mquery": {
		"userByEmailPass": function (email, password) {
			"use strict";
			return {$and:[{"email": email}, {"password": password}]};
		}
	}
};

module.exports = APPCONF;