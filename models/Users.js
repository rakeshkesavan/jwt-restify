const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  }
});

UserSchema.plugin(timestamp);

const User = mongoose.model("User", UserSchema);
module.exports = User;
