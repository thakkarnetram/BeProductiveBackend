const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    require: true,
  },
  // Changed because old wasn't needed as the relation is one to one and not one to many
  workspace: {
    _id: { type: String, ref: "Workspace" },
    workspaceName: { type: String },
  },
  admin: {
    type: String,
    ref: "users",
  },
  messages: [
    {
      text: {
        type: String,
      },
      sentBy: {
        type: String,
        ref: "users",
      },
      sentAt: {
        type: String,
        default: () => new Date().toLocaleTimeString(),
      },
      sentOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  members: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Channel = mongoose.model("channels", channelSchema);
module.exports = Channel;
