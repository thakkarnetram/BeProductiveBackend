const Workspace = require("../../../models/Workspace");
const Channel = require("../../../models/Channel");
const Message = require("../../../models/Message");
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

// WORKSPACE SECTION
exports.getWorkSpaces = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    // find all workspaces
    try {
        const workspaces = await Workspace.find({
            $or: [
                // space where the user is the admin or user is a member
                { admin: userId },
                { members: userId },
            ],
        });
        if (workspaces.length === 0) {
            return res
                .status(404)
                .json({ message: "No WorkSpaces found ! Create One " });
        }
        if (workspaces) {
            return res.status(200).json(workspaces);
        }
    } catch (e) {
        console.log(e);
        return res.status(501).json({ message: "Internal server error" });
    }
});

exports.getWorkSpaceById = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const spaceId = req.params._id;
    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }
    try {
        const findSpace = await Workspace.findById({ _id: spaceId });
        if (!findSpace) {
            return res.status(404).json({ message: "Workspace not Found" });
        }
        return res.status(200).json(findSpace);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

exports.getLatestSpace = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    try {
        const latestWorkspace = await Workspace.find({ admin: userId })
            .sort({ createdAt: -1 })
            .limit(2);

        if (!latestWorkspace) {
            return res
                .status(404)
                .json({ message: "No WorkSpace found for this user. Create one." });
        }

        return res.status(200).json(latestWorkspace);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

exports.createWorkSpace = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { workspace, projectName } = req.body;

    if (!workspace && !projectName) {
        return res
            .status(400)
            .json({ message: "Workspace & Projectname name cannot be empty" });
    }

    try {
        const existingWorkspace = await Workspace.findOne({
            workspace,
        });
        console.log(workspace);
        if (existingWorkspace) {
            console.log("Inside log  " + existingWorkspace);
            return res.status(400).json({ message: "Workspace name already exists" });
        }

        // Create a new workspace
        const newWorkspace = new Workspace({
            workspace,
            projectName,
            admin: userId,
            members: [userId],
        });

        // Save the new workspace
        const savedWorkspace = await newWorkspace.save();
        // TODO Before creating channel for the specific space need to make sure we dont save "" , instead create a general channel
        const newChannel = new Channel({
            channelName: projectName,
            workspace: {
                _id: savedWorkspace._id,
                workspaceName: savedWorkspace.workspace,
            },
            admin: userId,
        });

        // Save the new channel
        await newChannel.save();

        // Add the channel ID and channelName to the workspace's channels array
        savedWorkspace.channels.push({
            _id: newChannel._id,
            channelName: newChannel.channelName,
        });
        await savedWorkspace.save();

        return res.status(201).json(savedWorkspace);
    } catch (e) {
        console.error(e);
        return res.status(501).json({ message: "Internal server error" });
    }
});

// TODO UPDATE WORKSPACE NAME & DELETE A WORKSPACE
