const Workspace = require("../../../models/Workspace");
const Channel = require("../../../models/Channel");
const redis = require("../../../utils/caching-handler/redisClient");
const Message = require("../../../models/Message");
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

// WORKSPACE SECTION
exports.getWorkSpaces = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const cacheKey = `workspaces:${userId}`;
    // find all workspaces
    try {
        if (!redis.isReady) {
            console.warn('Redis not ready');
        } else {
            const cachedWorkspaces = await redis.get(cacheKey);
            if (cachedWorkspaces) {
                return res.status(200).json(JSON.parse(cachedWorkspaces))
            }
        }
        const workspaces = await Workspace.find({
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
        if (workspaces) {
            await redis.setEx(cacheKey, 3600, JSON.stringify(workspaces))
            return res.status(200).json(workspaces);
        }
    } catch (e) {
        console.log(e);
        return res.status(501).json({message: "Internal server error"});
    }
});

exports.getWorkSpaceById = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const spaceId = req.params._id;
    const cacheKey = `workspaceById:${userId}`;
    if (!userId) {
        return res.status(400).json({message: "User ID not found"});
    }
    try {
        if (!redis.isReady) {
            console.warn('Redis client not open')
        } else {
            const cachedWorkspace = await redis.get(cacheKey);
            if (cachedWorkspace) {
                return res.status(200).json(JSON.parse(cachedWorkspace))
            }
        }
        const findSpace = await Workspace.findById({_id: spaceId});
        if (!findSpace) {
            return res.status(404).json({message: "Workspace not Found"});
        }
        await redis.setEx(cacheKey, 3600, JSON.stringify(findSpace))
        return res.status(200).json(findSpace);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
});

exports.getLatestSpace = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const cacheKey = `latestWorkspace:${userId}`;
    try {
        if (!redis.isReady) {
            console.warn('Redis client not open')
        } else {
            const latestSpace = await redis.get(cacheKey);
            if (latestSpace) {
                return res.status(200).json(JSON.parse(latestSpace))
            }
        }
        const latestWorkspace = await Workspace.find({admin: userId})
            .sort({createdAt: -1})
            .limit(2);

        if (!latestWorkspace) {
            return res
                .status(404)
                .json({message: "No WorkSpace found for this user. Create one."});
        }
        await redis.setEx(cacheKey,3600,JSON.stringify(latestWorkspace))
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
        await redis.del(`workspaces:${userId}`)
        await redis.del(`workspaceById:${userId}`)
        await redis.del(`latestWorkspace:${userId}`)
        await savedWorkspace.save();

        return res.status(201).json(savedWorkspace);
    } catch (e) {
        console.error(e);
        return res.status(501).json({message: "Internal server error"});
    }
});

// TODO UPDATE WORKSPACE NAME & DELETE A WORKSPACE
