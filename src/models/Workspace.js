const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
    workspace: {
        type: String,
        require: true,
    },
    projectName: {
        type: String,
    },
    admin: {
        type: String,
        ref: "users",
    },
    members: [String],
    channels: [
        {
            _id: {
                type:String,
                ref: "channels",
            },
            channelName: {
                type: String,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Workspace = mongoose.model("Workspace", workspaceSchema);
module.exports = Workspace;
