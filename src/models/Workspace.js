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
    members: [
        {
            type: String,
            ref: "users",
        },
    ],
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

const Workspace = mongoose.model("workspaces", workspaceSchema);
module.exports = Workspace;
