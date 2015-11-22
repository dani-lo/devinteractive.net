/*
 * Serve JSON to our AngularJS client
 */
exports.jobs = function (req, res) {
	var collection = req.db.get('jobs');
	collection.find({$query:{},$orderby:{"added": 1}}, {},function(e, docs){
		res.json(docs);
	});
};

exports.experience = function (req, res) {
	var collection = req.db.get('experience');
	collection.find({$query:{},$orderby:{"_id": 1}}, {},function(e, docs){
		res.json(docs);
	});
};
/*
var express = require('express'),
	router = express.Router(),
	mongo = require('mongodb'),
	monk = require('monk'),
	db = monk('mongodb://lucky:lucky13@ds047652.mongolab.com:47652/l13menu');


exports.jobslist = function (req, res) {
	var collection = db.get('jobs');
	collection.find({},{},function(e, docs){
	    res.json(docs);
	});
};

 */