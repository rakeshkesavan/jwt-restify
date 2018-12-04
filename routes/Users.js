const error = require("restify-errors");
const userModel = require("../models/Users");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = server => {
  server.post("/register", (req, res, next) => {
    const { email, password } = req.body;
    const user = new userModel({
      email,
      password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        user.password = hash;

        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new error.InvalidContentError());
        }
      });
    });
  });
  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await auth.authenticate(email, password);
      const token = jwt.sign(user.toJSON(), config.JWT_SECTRET, {
        expiresIn: "10m"
      });
      const { iat, exp } = jwt.decode(token);
      res.send({ iat, exp, token }).send(201);
      next();
    } catch (err) {
      return next(new error.UnauthorizedError(err));
    }
  });
};
