"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const morgan = require("morgan");
const routes = require("./routes/index");
const config = require("config");

let dbOptions = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

// mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect(config.dbHost, dbOptions);
let db = mongoose.connection;
// mongo error
db.on("error", console.error.bind(console, "connection error:"));

// dont show the log for tests
if (config.util.getEnv("NODE_ENV") !== "test") {
  app.use(morgan("dev"));
}

// use sessions for tracking logins
app.use(session({
  secret: "Boxpop73",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// include routes
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.json({
    "message": err.message
  });
});

// listen on port
let port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("API server is listening on port", port);
});

module.exports = app; // for testing
