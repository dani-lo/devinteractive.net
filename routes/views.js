
/*
 * GET home page.
 */
var flash = require('express-flash');

exports.index = function(req, res){
  res.render('index');
};

exports.login = function (req, res) {
  	res.render('login', {"message": req.flash('error')});
};

exports.error = function(req, res){
  res.render('error');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};