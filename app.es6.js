/**
 * Module dependencies
 */
var express = require("express"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    flash = require("express-flash"),
    methodOverride = require("method-override"),
    errorhandler = require("errorhandler"),
    morgan = require("morgan"),
    views = require("./routes/views"),
    api = require("./routes/api"),
    auth = require("./routes/auth"),
    http = require("http"),
    path = require("path");

var mongo = require("mongodb"),
    monk = require("monk"),
    db = monk("mongodb://dani:danidev@ds045684.mongolab.com:45684/devinteractive");

var passport = require("passport"),
    GithubStrategy = require("passport-github").Strategy,
    LocalStrategy   = require("passport-local").Strategy;

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(morgan("dev"));
app.use(bodyParser());
app.use(methodOverride());
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "12woKjh7343ww02_P3n22xyT9",
  cookie: { maxAge: 60000 * 60 },
  resave: false,
  saveUninitialized: true
}));


/* Handle Login (Local and Github) */

app.use(passport.initialize());
app.use(passport.session());

// Make the db handle accessible to the routes
app.use(function (req,res,next) {
    "use strict";

    req.db = db;
    next();
});

passport.use("github-login", new GithubStrategy({
  clientID: "21abb346a3f57f99b2ad",
  clientSecret: "45d0e764fab12fd8b98cf7ec57cf5d1e0741ffd0",
  callbackURL: "https://devinteractive.herokuapp.com/auth/callback"
}, function (accessToken, refreshToken, profile, done) {
  //
  "use strict";
  
  done(null, {
    accessToken: accessToken,
    profile: profile
  });
}));

passport.use("local-login", new LocalStrategy({
        usernameField : "email",
        passwordField : "password",
        passReqToCallback : true
    },
    function(req, email, password, done) {
      //
      "use strict";

      var collection = req.db.get("users");

      collection.find({$and:[{"email": email}, {"password": password}]}, {},function(e, docs){
        //
        if (docs.length === 1) {
        
          var user =  docs[0];

          req.login(user, function () {
              return done(null, user);
          });
          
        } else {
          return done(null, false, req.flash("error", "No user found or wrong password."));
        }
      });
      
}));
    


passport.serializeUser(function(user, done) {
  //
  "use strict";
  
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //
  "use strict";

  done(null, user);
});

var env = process.env.NODE_ENV || "development";

if (env === "development") {
  app.use(errorhandler());
}

// production only
if (env === "production") {
  // TODO
  console.log("production");
}

function ensureAuthenticated(req, res, next) {
  //
  "use strict";

  if (req.isAuthenticated()) {

    return next();
  } else {
    res.redirect("/login");
  }
}
/**
 * Routes
 */

// serve index and view partials
app.get("/login/github", passport.authenticate("github-login", {
    successRedirect: "/app",
    failureRedirect: "/login",
    failureFlash : true
  }));

app.post("/login/local", function(req, res, next) {
  //
  "use strict";

  passport.authenticate("local-login", function(err, user, info) {
    
    var msg = {};

    if (err) {
      return next(err);
    }
    if (!user) {
      msg.status = "fail";
      msg.user = null;
      msg.text = "No user found or wrong email password combination";
    } else {
      msg.status = "success";
      msg.user = user;
      msg.text = "Welcome to devinteractive.net";
    }
    //
    return res.json(msg);
  })(req, res, next);
});

app.get("/auth/callback", function (req, res, next) {
    "use strict";
    next();
  },passport.authenticate("github-login", {
    successRedirect: "/app",
    failureRedirect: "/error",
    failureFlash : true
  }));

app.get("/partials/:name", views.partials);

//
app.get("/api/jobs", api.jobs);
//
app.get("/api/experience", api.experience);
//
app.get("/login", views.login);

app.get("/logout", function (req, res) {
  "use strict";
  req.logout();
  req.session.destroy();
  res.redirect("/login");
});

app.get("/app*", ensureAuthenticated, views.index);

app.get("/", function (req, res) {
  "use strict";
  res.redirect("/app");
});
/**
 * Start Server
 */

http.createServer(app).listen(app.get("port"), function () {
  "use strict";

  console.log("Express server listening on port " + app.get("port"));
});