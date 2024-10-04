const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    require: true,
  },
  workspace: [
    {
      _id: {
        type: String,
        ref: "workspace",
      },
      workspaceName: {
        type: String,
      },
    },
  ],
  admin: {
    type: String,
    ref: "users",
  },
  messages: [
    {
      text: String,
      user: {
        type: String,
        ref: "users",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  members: [
    {
      type: String,
      ref: "users",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Channel = mongoose.model("channels", channelSchema);
module.exports = Channel;
