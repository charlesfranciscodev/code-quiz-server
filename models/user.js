const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sanitize = require("mongo-sanitize");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  avatarUrl: {
    type: String,
    required: false,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  }
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  email = sanitize(email);
  User.findOne({ email: email }).exec(function (err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      let error = new Error("User not found.");
      error.status = 401;
      return callback(error);
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

UserSchema.pre("save", function(next) {
  const user = this;
  // hash password before saving to database
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err)
      return next(err);
    user.password = hash;
    next();
  });
});

let User = mongoose.model("User", UserSchema);
module.exports = User;
