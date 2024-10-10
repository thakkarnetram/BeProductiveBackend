const Invite = require("../models/Invite");
const User = require("../models/User");
const Workspace = require("../models/Workspace");
const Channels = require("../models/Channel");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");

// Endpoint
exports.generateInviteLink = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { workspaceId } = req.params;

  try {
    // Find the workspace by the ID provided in the URL
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    if (!workspace.members.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this workspace" });
    }
    // Generate the invite link (in this case, just using the workspace ID)
    const inviteLink = `${process.env.ROOT_URL_KOYEB}/api/v1/invite/join/${workspaceId}`;

    return res.status(200).json({ inviteLink });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.joinWorkspace = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id; // User that is trying to join the workspace
  const { workspaceId } = req.params;

  try {
    // Find the workspace using the ID from the invite link
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // if the user is already a member of the workspace
    if (workspace.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this workspace" });
    }

    // Add the user to the workspace members
    workspace.members.push(userId);
    await workspace.save();

    // Find all channels associated with the workspace
    const channels = await Channels.find({ "workspace._id": workspaceId });

    // Add the user to the members of each channel
    for (const channel of channels) {
      if (!channel.members.includes(userId)) {
        channel.members.push(userId);
        await channel.save();
      }
    }

    return res
      .status(200)
      .json({ message: "Successfully joined the workspace", workspace });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
