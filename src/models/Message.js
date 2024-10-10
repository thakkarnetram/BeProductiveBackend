const mongoose = require("mongoose");
const { mongo } = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
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
  channel: {
    type: String,
    ref: "channels",
  },
});

const Message = mongoose.model("messages", messageSchema);
module.exports = Message;
