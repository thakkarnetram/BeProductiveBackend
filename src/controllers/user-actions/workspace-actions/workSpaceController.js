const Workspace = require("../../../models/Workspace");
const Channel = require("../../../models/Channel");
const cache = require("../../../utils/caching/workspaceCache")
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

// WORKSPACE SECTION

exports.getWorkSpaces = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const cacheKey = `workspaces:${userId}`;

    if (cache.has(cacheKey)) {
        const cached = JSON.parse(cache.get(cacheKey));
        return res.status(200).json(cached);
    }

    try {
        const workspaces = await Workspace.find({
            $or: [{ admin: userId }, { members: userId }],
        });

        if (workspaces.length === 0) {
            return res.status(404).json({ message: "No WorkSpaces found ! Create One " });
        }

        cache.set(cacheKey, JSON.stringify(workspaces));
        return res.status(200).json(workspaces);
    } catch (e) {
        console.log(e);
        return res.status(501).json({ message: "Internal server error" });
    }
});

exports.getWorkSpaceById = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const spaceId = req.params._id;
    const cacheKey = `workspaceById:${userId}:${spaceId}`;

    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }

    if (cache.has(cacheKey)) {
        const cached = JSON.parse(cache.get(cacheKey));
        return res.status(200).json(cached);
    }

    try {
        const findSpace = await Workspace.findById(spaceId);

        if (!findSpace) {
            return res.status(404).json({ message: "Workspace not Found" });
        }

        cache.set(cacheKey, JSON.stringify(findSpace));
        return res.status(200).json(findSpace);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

exports.getLatestSpace = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const cacheKey = `latestWorkspace:${userId}`;

    if (cache.has(cacheKey)) {
        const cached = JSON.parse(cache.get(cacheKey));
        return res.status(200).json(cached);
    }

    try {
        const latestWorkspace = await Workspace.find({ admin: userId })
            .sort({ createdAt: -1 })
            .limit(2);

        if (!latestWorkspace || latestWorkspace.length === 0) {
            return res.status(404).json({ message: "No WorkSpace found for this user. Create one." });
        }

        cache.set(cacheKey, JSON.stringify(latestWorkspace));
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
        return res.status(400).json({ message: "Workspace & Projectname name cannot be empty" });
    }

    try {
        const existingWorkspace = await Workspace.findOne({ workspace });

        if (existingWorkspace) {
            return res.status(400).json({ message: "Workspace name already exists" });
        }

        const newWorkspace = new Workspace({
            workspace,
            projectName,
            admin: userId,
            members: [userId],
        });

        const savedWorkspace = await newWorkspace.save();

        const newChannel = new Channel({
            channelName: projectName,
            workspace: {
                _id: savedWorkspace._id,
                workspaceName: savedWorkspace.workspace,
            },
            admin: userId,
        });

        await newChannel.save();

        savedWorkspace.channels.push({
            _id: newChannel._id,
            channelName: newChannel.channelName,
        });

        // Invalidate relevant cache
        cache.del(`workspaces:${userId}`);
        cache.del(`latestWorkspace:${userId}`);

        await savedWorkspace.save();

        return res.status(201).json(savedWorkspace);
    } catch (e) {
        console.error(e);
        return res.status(501).json({ message: "Internal server error" });
    }
});

exports.updateWorkspace = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const admin = req.user._id;
    const updatedWorkspace = req.body.workspace;

    if (!updatedWorkspace) {
        return res.status(400).json({ message: 'Please provide a workspace name' });
    }

    try {
        const workspace = await Workspace.findOne({ _id, admin });
        if (!workspace) {
            return res.status(403).json({ message: 'Unauthorized to update workspace' });
        }

        const options = { new: true };
        const update = await Workspace.findByIdAndUpdate(
            _id,
            { workspace: updatedWorkspace },
            options
        );

        // Invalidate relevant cache
        cache.del(`workspaces:${admin}`);
        cache.del(`latestWorkspace:${admin}`);
        cache.del(`workspaceById:${admin}:${_id}`);

        return res.status(200).json({ message: 'Workspace name updated!', update });
    } catch (err) {
        return res.status(501).json({ message: `Internal Server error ${err}` });
    }
});

exports.deleteWorkspace = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const admin = req.user._id;

    try {
        const findSpace = await Workspace.findOne({ _id, admin });
        if (!findSpace) {
            return res.status(403).json({ message: 'Unauthorized to delete the space' });
        }

        const deleteSpace = await Workspace.findByIdAndDelete({ _id, admin });

        // Invalidate relevant cache
        cache.del(`workspaces:${admin}`);
        cache.del(`latestWorkspace:${admin}`);
        cache.del(`workspaceById:${admin}:${_id}`);

        return res.status(200).json({ message: "Workspace deleted", deleteSpace });
    } catch (err) {
        return res.status(501).json({ message: `Internal server error ${err}` });
    }
});
