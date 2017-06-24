/* eslint-env mocha */

process.env.NODE_ENV = "test";

const User = require("../models/user");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);

describe("Users", () => {
  beforeEach((done) => {
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

  function loginValidExpect(res) {
    res.should.have.status(200);
    expect(res).to.have.cookie("connect.sid");
    res.body.should.be.a("object");
    res.body.should.have.property("user");
    const user = res.body.user;
    user.should.have.property("id");
    user.should.have.property("email");
    user.should.have.property("username");
  }

  describe("POST /login valid", () => {
    it("should log in the user", (done) => {
      // login the user
      chai.request(app)
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "Soshag29",
        })
        .end((err, res) => {
          loginValidExpect(res);
          res.body.should.have.property("message").eql("Login successful.");
          done();
        });
    });
  });

  function unauthorizedLoginExpect(res) {
    res.should.have.status(401);
    expect(res).to.not.have.cookie("connect.sid");
    res.body.should.be.a("object");
  }

  function postLoginWithMissingFields(data) {
    it("should not log in the user", (done) => {
      // register the user
      chai.request(app)
        .post("/login")
        .send(data)
        .end((err, res) => {
          unauthorizedLoginExpect(res);
          res.body.should.have.property("message").eql("Email and password are required.");
          done();
        });
    });
  }

  describe("POST /login with missing email", () => {
    postLoginWithMissingFields({"password": "Soshag29"});
  });

  describe("POST /login with missing password", () => {
    postLoginWithMissingFields({"email": "charlantfr@gmail.com"});
  });

  describe("POST /login with invalid email", () => {
    it("should not log in the user", (done) => {
      // login the user
      chai.request(app)
        .post("/login")
        .send({
          "email": "invalid@gmail.com",
          "password": "Soshag29",
        })
        .end((err, res) => {
          unauthorizedLoginExpect(res);
          res.body.should.have.property("message").eql("Wrong email or password.");
          done();
        });
    });
  });

  describe("POST /login with invalid password", () => {
    it("should not log in the user", (done) => {
      // login the user
      chai.request(app)
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "invalid",
        })
        .end((err, res) => {
          unauthorizedLoginExpect(res);
          res.body.should.have.property("message").eql("Wrong email or password.");
          done();
        });
    });
  });

  describe("POST /login injection", () => {
    it("should not log in the user", (done) => {
      // login the user
      chai.request(app)
        .post("/login")
        .send({
          "email": {"$gt":""},
          "password": "Soshag29",
        })
        .end((err, res) => {
          unauthorizedLoginExpect(res);
          res.body.should.have.property("message").eql("Wrong email or password.");
          done();
        });
    });
  });

  describe("POST /register with all fields", () => {
    it("should create a new user", (done) => {
      // register the user
      chai.request(app)
        .post("/register")
        .send({
          "email": "charlesfranciscodev@gmail.com",
          "password": "Menpaw81",
          "username": "fire",
          "firstName": "Charlie",
          "lastName": "Brown",
          "avatarUrl": "http://placeimg.com/500/500/any"
        })
        .end((err, res) => {
          loginValidExpect(res);
          res.body.should.have.property("message").eql("User successfully created.");
          const user = res.body.user;
          user.should.have.property("firstName");
          user.should.have.property("lastName");
          user.should.have.property("avatarUrl");
          user.should.have.property("createdAt");
          done();
        });
    });
  });

  describe("POST /register with required fields only", () => {
    it("should create a new user", (done) => {
      // register the user
      chai.request(app)
        .post("/register")
        .send({
          "email": "charles@mail.com",
          "password": "Mugnoh30",
          "username": "ice"
        })
        .end((err, res) => {
          loginValidExpect(res);
          res.body.should.have.property("message").eql("User successfully created.");
          const user = res.body.user;
          user.should.have.property("createdAt");
          done();
        });
    });
  });

  function postRegister(data, status, message) {
    it("should not create a new user", (done) => {
      // register the user
      chai.request(app)
        .post("/register")
        .send(data)
        .end((err, res) => {
          res.should.have.status(status);
          expect(res).to.not.have.cookie("connect.sid");
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql(message);
          done();
        });
    });
  }

  function postRegisterAll(registerArray, status, message) {
    for (const registerItem of registerArray)
      describe(registerItem[1], () => postRegister(registerItem[0], status, message));
  }

  const registerMissing = [
    [{"password": "Bomtyj77", "username": "lightning"}, "POST /register with missing email"],
    [{"email": "charles2@mail.com", "username": "lightning"}, "POST /register with missing password"],
    [{"email": "charles2@mail.com","password": "Bomtyj77"}, "POST /register with missing username"]
  ];

  postRegisterAll(registerMissing, 400, "Missing required fields.");

  describe("POST /register with existing email", () => {
    postRegister({"email": "charlantfr@gmail.com", "password": "Wilzug26", "username": "bolt"},
                 409, "Email already in use.");
  });

  describe("POST /register with existing username", () => {
    postRegister({"email": "charlantfr@mail.com", "password": "Wilzug26", "username": "charlesfranciscodev"},
                 409, "Username already in use.");
  });

  // GET /profile
  describe("GET /profile valid", () => {
    it("should get the user's profile info", (done) => {
      // login the user
      const agent = chai.request.agent(app);
      agent
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "Soshag29",
        })
        .then((res) => {
          res.should.have.status(200);
          expect(res).to.have.cookie("connect.sid");

          // get the user's profile info
          return agent.get("/profile")
          .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("user");
            const user = res.body.user;
            user.should.have.property("email");
            user.should.have.property("username");
            user.should.have.property("firstName");
            user.should.have.property("lastName");
            user.should.have.property("avatarUrl");
            done();
          });
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  function unauthorizedExpect(res) {
    res.should.have.status(401);
    res.response.body.should.be.a("object");
    res.response.body.should.have.property("message").eql("You must be logged in to access this content.");
    res.response.body.should.not.have.property("user");
  }

  // GET /profile
  describe("GET /profile without logging in", () => {
    it("should not get the user's profile info", (done) => {
      chai.request(app)
        .get("/profile")
        .catch((res) => {
          unauthorizedExpect(res);
          done();
        });
    });
  });

  // PUT /profile
  describe("PUT /profile", () => {
    it("should update the user's profile info", (done) => {
      // login the user
      const agent = chai.request.agent(app);
      agent
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "Soshag29",
        })
        .then((res) => {
          res.should.have.status(200);
          expect(res).to.have.cookie("connect.sid");

          const user = {
            "email": "charlantfr2@gmail.com",
            "username": "charlesfranciscodev2",
            "firstName": "Charles2",
            "lastName": "Francisco2",
            "avatarUrl": "http://placeimg.com/450/450/any"
          };

          // update the user's profile info
          return agent.put("/profile")
          .send({
            "email": user.email,
            "password": "Tevdud26",
            "username": user.username,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "avatarUrl": user.avatarUrl
          })
          .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("user");
            const userRes = res.body.user;
            expect(userRes).to.eql(user);
            done();
          });
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  // PUT /profile
  describe("PUT /profile without logging in", () => {
    it("should not update the user's profile info", (done) => {
      chai.request(app)
        .put("/profile")
        .catch((res) => {
          unauthorizedExpect(res);
          done();
        });
    });
  });

  // DELETE /profile
  describe("DELETE /profile", () => {
    it("should delete the user's account", (done) => {
      // login the user
      const agent = chai.request.agent(app);
      agent
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "Soshag29",
        })
        .then((res) => {
          res.should.have.status(200);
          expect(res).to.have.cookie("connect.sid");

          // delete the user's account
          return agent.delete("/profile")
          .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("User sucessfully deleted.");
            res.body.should.have.property("result");
            const result = res.body.result;
            result.should.have.property("n").eql(1);
            result.should.have.property("ok").eql(1);
            done();
          });
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  // DELETE /profile
  describe("DELETE /profile without logging in", () => {
    it("should not delete the user's account", (done) => {
      chai.request(app)
        .delete("/profile")
        .catch((res) => {
          unauthorizedExpect(res);
          done();
        });
    });
  });

  // GET /logout
  describe("GET /logout", () => {
    it("should log out the user", (done) => {
      // login the user
      const agent = chai.request.agent(app);
      agent
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "Soshag29",
        })
        .then((res) => {
          res.should.have.status(200);
          expect(res).to.have.cookie("connect.sid");

          // delete the user's account
          return agent.get("/logout")
          .then((res) => {
            res.should.have.status(200);
            expect(res).to.not.have.cookie("connect.sid");
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Logout successful.");
            done();
          });
        })
        .catch(function (err) {
          throw err;
        });
    });
  });
});
