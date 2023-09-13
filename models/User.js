const mongoose = require("mongoose");
const shortid = require("shortid");
const ToDo = require("../models/Todos");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  role: {
    type: String,
    default: "USER",
  },
  name: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isGoogleAuth: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
