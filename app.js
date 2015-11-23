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
    http = require("http"),
    path = require("path"),
    appConf = require("./local_modules/conf"),
    appUtil = require("./local_modules/util");

var mongo = require("mongodb"),
    monk = require("monk"),
    db = monk(appConf.dbconn);

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
  secret: appConf.secret,
  cookie: { maxAge: 60000 * 60 },
  resave: false,
  saveUninitialized: true
}));


/* Handle Login (Local and Github) */

app.use(passport.initialize());
app.use(passport.session());

// Make the db handle accessible to the routes
app.use(function(req,res,next){
    "use strict";
    req.db = db;
    next();
});

passport.use("github-login", new GithubStrategy({
  clientID: appConf.auth.github.clientID,
  clientSecret: appConf.auth.github.clientSecret,
  callbackURL: appConf.auth.github.callbackURL
}, function(accessToken, refreshToken, profile, done){
    "use strict";
    done(null, {
      accessToken: accessToken,
      profile: profile
    });
}));

passport.use("local-login", new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : "email",
        passwordField : "password",
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
      //
      "use strict";

      var collection = req.db.get("users");

      collection.find(appConf.mquery.userByEmailPass(email, password), {},function(e, docs){
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
  // for the time being tou can serialize the user 
  // object {accessToken: accessToken, profile: profile }
  // In the real app you might be storing on the id like user.profile.id 
  "use strict";
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // If you are storing the whole user on session we can just pass to the done method, 
  // But if you are storing the user id you need to query your db and get the user 
  //object and pass to done() 
  "use strict";
  done(null, user);
});

var env = process.env.NODE_ENV || "development";

// development only
if (env === "development") {
  app.use(errorhandler());
}

// production only
if (env === "production") {
  // TODO
  console.log("production")
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

// JSON API
app.get("/api/jobs", api.jobs);
// JSON API
app.get("/api/experience", api.experience);
// redirect all others to the index (HTML5 history)
app.get("/login", views.login);

// redirect all others to the index (HTML5 history)
app.get("/logout", function (req, res) {
  "use strict";
  req.logout();
  req.session.destroy();
  res.redirect("/login");
});

app.get("/app*", appUtil.ensureAuthenticated, views.index);
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
