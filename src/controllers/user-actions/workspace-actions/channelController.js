const Workspace   = require("../../../models/Workspace");
const Channel     = require("../../../models/Channel");
const cache = require("../../../utils/caching/workspaceCache")
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

function cloneDoc(doc) {
    return JSON.parse(JSON.stringify(doc));
}

function idsAsStrings(arr = []) {
    return arr.map(id => id.toString());
}

exports.getChannels = asyncErrorHandler(async (req, res) => {
    const userId = req.user._id.toString();
    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }

    const cacheKey = `channels:${userId}`;
    let channels;

    if (cache.has(cacheKey)) {
        channels = cache.get(cacheKey);
    } else {
        channels = await Channel.find({
            $or: [
                { admin: userId },
                { members: userId },
            ],
        });
        if (!channels.length) {
            return res.status(404).json({ message: "No channels found! Create one." });
        }
        channels = cloneDoc(channels);
        cache.set(cacheKey, channels);
    }

    return res.status(200).json(channels);
});

exports.getChannelById = asyncErrorHandler(async (req, res) => {
    const userId    = req.user._id.toString();
    const channelId = req.params._id;

    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }

    const cacheKey = `channelById:${userId}:${channelId}`;
    let channelDoc;

    if (cache.has(cacheKey)) {
        channelDoc = cache.get(cacheKey);
    } else {
        const found = await Channel.findById(channelId);
        if (!found) {
            return res.status(404).json({ message: "Channel not found" });
        }
        channelDoc = cloneDoc(found);
        cache.set(cacheKey, channelDoc);
    }

    const isAdmin  = channelDoc.admin.toString() === userId;
    const members  = idsAsStrings(channelDoc.members);
    const isMember = members.includes(userId);

    if (!isAdmin && !isMember) {
        return res.status(403).json({ message: "Permission denied" });
    }

    return res.status(200).json(channelDoc);
});

// GET /api/v1/channel/latest
exports.getLatestChannel = asyncErrorHandler(async (req, res) => {
    const userId = req.user._id.toString();
    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }

    const cacheKey = `latestChannel:${userId}`;
    let latest;

    if (cache.has(cacheKey)) {
        latest = cache.get(cacheKey);
    } else {
        latest = await Channel.find({
            $or: [
                { admin: userId },
                { members: userId },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(2);

        if (!latest.length) {
            return res.status(404).json({ message: "No Channel found" });
        }

        latest = cloneDoc(latest);
        cache.set(cacheKey, latest);
    }

    return res.status(200).json(latest);
});

exports.createChannel = asyncErrorHandler(async (req, res) => {
    const userId      = req.user._id.toString();
    const workspaceId = req.params._id;
    const { channelName } = req.body;

    if (!channelName) {
        return res.status(400).json({ message: "Channel name is required" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        return res.status(404).json({ message: "No workspace found with Id" });
    }

    const newChannel = new Channel({
        channelName,
        workspace: {
            _id: workspace._id,
            workspaceName: workspace.workspaceName || workspace.workspace,
        },
        admin: userId,
    });
    await newChannel.save();

    // add to workspace
    workspace.channels.push({
        _id: newChannel._id,
        channelName: newChannel.channelName,
    });
    await workspace.save();

    // invalidate caches
    const affectedUsers = [...new Set([userId, ...workspace.members.map(m => m.toString())])];

    affectedUsers.forEach(uid => {
        // 1. Invalidate all relevant CHANNEL caches for each user
        cache.del(`channels:${uid}`);
        cache.del(`latestChannel:${uid}`);

        // 2. 🔥 Invalidate all relevant WORKSPACE caches for each user (The Fix)
        workspaceCache.del(`workspaces:${uid}`);
        workspaceCache.del(`latestWorkspace:${uid}`);
        workspaceCache.del(`workspaceById:${uid}:${workspaceId}`);
    });

    return res.status(201).json({ message: "Channel Created", newChannel });
});

exports.updateChannel = asyncErrorHandler(async (req, res) => {
    const userId            = req.user._id.toString();
    const channelId         = req.params._id;
    const updatedChannelName= req.body.channelName;

    if (!updatedChannelName) {
        return res.status(400).json({ message: "Please provide a channel name" });
    }

    // only admin can rename
    const channel = await Channel.findOne({ _id: channelId, admin: userId });
    if (!channel) {
        return res.status(403).json({ message: "Unauthorized to update this" });
    }

    const result = await Channel.findByIdAndUpdate(
        channelId,
        { channelName: updatedChannelName },
        { new: true }
    );

    // invalidate caches
    cache.del(`channels:${userId}`);
    cache.del(`latestChannel:${userId}`);
    cache.del(`channelById:${userId}:${channelId}`);

    return res.status(200).json({ message: "Channel name updated!", result });
});


exports.deleteChannel = asyncErrorHandler(async (req, res) => {
    const userId    = req.user._id.toString();
    const channelId = req.params._id;

    // only admin can delete
    const channel = await Channel.findOne({ _id: channelId, admin: userId });
    if (!channel) {
        return res.status(403).json({ message: "Unauthorized to delete the channel" });
    }

    const deleted = await Channel.findByIdAndDelete(channelId);

    // invalidate caches
    cache.del(`channels:${userId}`);
    cache.del(`latestChannel:${userId}`);
    cache.del(`channelById:${userId}:${channelId}`);

    return res.status(200).json({ message: "Channel deleted", deleted });
});
