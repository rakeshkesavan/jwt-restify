const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const UserModel = mongoose.model("User");

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({ email });
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          resolve(user);
        } else {
          reject("Auth Failed");
        }
      });
    } catch (err) {
      reject("Auth failed");
    }
  });
};
