const mongoose = require("mongoose");
const shortid = require("shortid");

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
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  friends: [
    {
      type: String,
      ref: "users",
    },
  ],
  fcmTokens: [
      { type: String }
  ],
  plan:{
    type:String,
    enum:["free","pro"],
    default:"free"
  },
  subscription:{
    entitlement:{
      type:String
    },
    productId:{
      type:String
    },
    expiry:{
      type:Date
    },
    lastSynced:{
      type:Date
    }
  }
},{timestamps:true});

const User = mongoose.model("users", userSchema);

module.exports = User;
