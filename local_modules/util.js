var errorRedirect = "/login";

exports.ensureAuthenticated = function (req, res, next) {
  //
  "use strict";
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect(errorRedirect);
  }
}