process.env.NODE_ENV = "test";

//const mongoose = require("mongoose");
const User = require("../models/user");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);

describe("Users", () => {
  before((done) => {
    // empty the database
    const remove = User.remove({});
    const user = new User({
      "email": "charlantfr@gmail.com",
      "password": "Soshag29",
      "username": "charlesfranciscodev",
      "firstName": "Charles",
      "lastName": "Francisco",
      "avatarUrl": "http://placeimg.com/400/400/any"
    });
    remove.exec().then(() => {
      // create a test user
      return user.save();
    })
    .then(() => {
      done();
    });
  });

  // POST /login test
  describe("POST /login", () => {
    it("should log the user", (done) => {
      // login the user
      chai.request(app)
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "Soshag29",
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.have.cookie("connect.sid");
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Login successful.");
          res.body.should.have.property("user");
          const user = res.body.user;
          user.should.have.property("id");
          user.should.have.property("email");
          user.should.have.property("username");
          done();
        });
    });
  });
});
