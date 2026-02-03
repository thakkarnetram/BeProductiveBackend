const mongoose = require("mongoose");
const shortid = require("shortid");

const inviteSchema = new mongoose.Schema({
  // who generates the link
  inviter: {
    type: String,
    default: shortid.generate,
    ref: "users",
    required: true,
  },
  // who recieves the link
  invitee: {
    type: String,
    default: shortid.generate,
    ref: "users",
    required: true,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
},{timestamps:true});

const Invite = mongoose.model("Invite", inviteSchema);
module.exports = Invite;
