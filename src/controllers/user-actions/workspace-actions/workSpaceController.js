const Workspace = require("../../../models/Workspace");
const Channel = require("../../../models/Channel");
const NodeCache = require("node-cache");
const workspaceCache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 1600
});
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");
const {async} = require("seed");

// WORKSPACE SECTION
exports.getWorkSpaces = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    // find all workspaces
    try {
        let workspaces;
        workspaces = await Workspace.find({
            $or: [
                // space where the user is the admin or user is a member
                {admin: userId},
                {members: userId},
            ],
        });
        if (workspaces.length === 0) {
            return res
                .status(404)
                .json({message: "No WorkSpaces found ! Create One "});
        }
        if (workspaceCache.has(`workspaces:${userId}`)) {
            workspaces = JSON.parse(workspaceCache.get(`workspaces:${userId}`))
        } else {
            workspaceCache.set(`workspaces:${userId}`, JSON.stringify(workspaces))
        }
        return res.status(200).json(workspaces);

    } catch (e) {
        console.log(e);
        return res.status(501).json({message: "Internal server error"});
    }
});

exports.getWorkSpaceById = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const spaceId = req.params._id;
    if (!userId) {
        return res.status(400).json({message: "User ID not found"});
    }
    try {
        let findSpace;
        findSpace = await Workspace.findById({_id: spaceId});
        if (!findSpace) {
            return res.status(404).json({message: "Workspace not Found"});
        }
        if (workspaceCache.has(`workspaceById:${userId}`)) {
            findSpace = JSON.parse(workspaceCache.get(`workspaceById:${userId}`))
        } else {
            workspaceCache.set(`workspaceById:${userId}`, JSON.stringify(findSpace))
        }
        return res.status(200).json(findSpace);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
});

exports.getLatestSpace = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    try {
        let latestWorkspace;
        latestWorkspace = await Workspace.find({admin: userId})
            .sort({createdAt: -1})
            .limit(2);
        if (!latestWorkspace) {
            return res
                .status(404)
                .json({message: "No WorkSpace found for this user. Create one."});
        }
        if (workspaceCache.has(`latestWorkspace:${userId}`)) {
            latestWorkspace = JSON.parse(workspaceCache.get(`latestWorkspace:${userId}`))
        } else {
            workspaceCache.set(`latestWorkspace:${userId}`, JSON.stringify(latestWorkspace))
        }
        return res.status(200).json(latestWorkspace);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
});

exports.createWorkSpace = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const {workspace, projectName} = req.body;

    if (!workspace && !projectName) {
        return res
            .status(400)
            .json({message: "Workspace & Projectname name cannot be empty"});
    }

    try {
        const existingWorkspace = await Workspace.findOne({
            workspace,
        });
        console.log(workspace);
        if (existingWorkspace) {
            console.log("Inside log  " + existingWorkspace);
            return res.status(400).json({message: "Workspace name already exists"});
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
        workspaceCache.del(`workspaces:${userId}`)
        workspaceCache.del(`workspaceById:${userId}`)
        workspaceCache.del(`latestWorkspace:${userId}`)
        await savedWorkspace.save();

        return res.status(201).json(savedWorkspace);
    } catch (e) {
        console.error(e);
        return res.status(501).json({message: "Internal server error"});
    }
});

// TODO UPDATE WORKSPACE NAME & DELETE A WORKSPACE
exports.updateWorkspace = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const admin = req.user._id;
    const updatedWorkspace = req.body.workspace;
    if (!updatedWorkspace) {
        return res.status(400).json({message: 'Please provided a workspace name'})
    }
    try {
        const workspace = await Workspace.findOne({_id, admin});
        console.log(workspace)
        if (!workspace) {
            return res.status(403).json({message: 'Unauthorized to update workspace'})
        }
        const options = {new: true};
        const update = await Workspace.findByIdAndUpdate(
            _id,
            {workspace: updatedWorkspace},
            options
        );
        workspaceCache.del(`workspaces:${admin}`)
        workspaceCache.del(`workspaceById:${admin}`)
        workspaceCache.del(`latestWorkspace:${admin}`)
        return res.status(200).json({message: 'Workspace name updated !', update})
    } catch (err) {
        return res.status(501).json({message: `Internal Server error ${err}`})
    }
})

exports.deleteWorkspace = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const admin = req.user._id;
    try {
        const findSpace = await Workspace.findOne({_id, admin});
        if (!findSpace) {
            return res.status(403).json({message: 'Unauthorized to delete the space'})
        }
        const deleteSpace = await Workspace.findByIdAndDelete({_id, admin});
        workspaceCache.del(`workspaces:${admin}`)
        workspaceCache.del(`workspaceById:${admin}`)
        workspaceCache.del(`latestWorkspace:${admin}`)
        return res.status(200).json({message: "Workspace deleted ", deleteSpace})
    } catch (err) {
        return res.status(501).json({message: `Internal server error ${err}`})
    }
})
