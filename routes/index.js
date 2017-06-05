const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mid = require("../middleware");

function userResponse(user) {
  return {
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl
  };
}

// POST /login
router.post("/login", (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        let err = new Error("Wrong email or password.");
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.json({
          "message": "Login successful.",
          "user": {
            id: user._id,
            email: user.email,
            username: user.username
          }
        });
      }
    });
  } else {
    res.status(401);
    return res.json({
      "message": "Email and password are required."
    });
  }
});

// POST /register
router.post("/register", (req, res, next) => {
  let body = req.body;
  if (body.email && body.password && body.username) {
    // create object with form input
    let userData = {
      email: body.email,
      password: body.password,
      username: body.username
    };
    if (body.firstName)
      userData.firstName = body.firstName;
    if (body.lastName)
      userData.lastName = body.lastName;
    if (body.avatarUrl)
      userData.avatarUrl = body.avatarUrl;

    // insert document into Mongo
    User.create(userData, (error, user) => {
      if (error) return next(error);
      req.session.userId = user._id;
      return res.json({
        "message": "User successfully created.",
        "user": {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt
        }
      });
    });
  } else {
    let error = new Error("Missing required fields");
    error.status = 400;
    return next(error);
  }
});

// GET /profile
router.get("/profile", mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId).exec((err, user) => {
    if (err) {
      return next(err);
    } else {
      return res.json({
        "user": userResponse(user)
      });
    }
  });
});

// PUT /profile
router.put("/profile", mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId).exec((err, user) => {
    if (err) return next(err);
    Object.assign(user, req.body).save((err, user) => {
      if (err) return next(err);
      return res.json({
        "message": "User sucessfully updated.",
        "user": userResponse(user)
      });
    });
  });
});

// DELETE /profile
router.delete("/profile", mid.requiresLogin, (req, res, next) => {
  User.remove(req.session.userId).exec((err, result) => {
    if (err) return next(err);
    return res.json({
      "message": "User sucessfully deleted.",
      result
    });
  });
});

// GET /logout
router.get("/logout", (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) return next(err);
      return res.json({
        "message": "Logout successful."
      });
    });
  }
});

module.exports = router;
