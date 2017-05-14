var express = require("express");
var router = express.Router();
var User = require("../models/user");
var mid = require("../middleware");

// GET /profile
router.get("/profile", mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId).exec(function (err, user) {
    if (err) {
      return next(err);
    } else {
      return res.json({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl
      });
    }
  });
});

// GET /logout
router.get("/logout", function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return;
      }
    });
  }
});

// POST /login
router.post("/login", function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error("Wrong email or password.");
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect("/profile");
      }
    });
  } else {
    var err = new Error("Email and password are required.");
    err.status = 401;
    return next(err);
  }
});

// POST /register
router.post("/register", function(req, res, next) {
  var body = req.body;
  if (body.email && body.password) {
    // create object with form input
    var userData = {
      email: body.email,
      password: body.password
    };
    if (body.firstName) userData.firstName = body.firstName;
    if (body.lastName) userData.lastName = body.lastName;
    if (body.avatarUrl) userData.avatarUrl = body.avatarUrl;

    // insert document into Mongo
    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect("/profile");
      }
    });
  } else {
    var error = new Error("Missing required fields");
    error.status = 400;
    return next(error);
  }
});

module.exports = router;
