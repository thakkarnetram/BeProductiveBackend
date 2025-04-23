const Workspace = require("../../../models/Workspace");
const Channel = require("../../../models/Channel");
const NodeCache = require("node-cache");
const channelCache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 1600
});
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

// CHANNEL SECTION
exports.getChannels = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }
    try {
        let channels = await Channel.find({
            $or: [
                { admin: userId },
                { members: userId },
            ],
        });
        if (!channels || channels.length === 0) {
            return res
                .status(404)
                .json({ message: "No channels found! Create one." });
        }
        const cacheKey = `channels:${userId}`;
        if (channelCache.has(cacheKey)) {
            channels = JSON.parse(channelCache.get(cacheKey));
        } else {
            channelCache.set(cacheKey, JSON.stringify(channels));
        }
        return res.status(200).json(channels);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

exports.getChannelById = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const channelId = req.params._id;
    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }
    try {
        const cacheKey = `channelById:${userId}:${channelId}`;
        let findChannel;
        if (channelCache.has(cacheKey)) {
            findChannel = JSON.parse(channelCache.get(cacheKey));
        } else {
            findChannel = await Channel.findById(channelId);
            if (!findChannel) {
                return res.status(404).json({ message: "Channel not found" });
            }
            channelCache.set(cacheKey, JSON.stringify(findChannel));
        }
        if (
            findChannel.admin.toString() !== userId &&
            !findChannel.members.includes(userId)
        ) {
            return res.status(403).json({ message: "Permission denied" });
        }
        return res.status(200).json(findChannel);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

exports.getLatestChannel = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    try {
        let latestChannel = await Channel.find({
            $or: [
                { admin: userId },
                { members: userId },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(2);
        if (!latestChannel || latestChannel.length === 0) {
            return res.status(404).json({ message: "No Channel found" });
        }
        const cacheKey = `latestChannel:${userId}`;
        if (channelCache.has(cacheKey)) {
            latestChannel = JSON.parse(channelCache.get(cacheKey));
        } else {
            channelCache.set(cacheKey, JSON.stringify(latestChannel));
        }
        return res.status(200).json(latestChannel);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

exports.createChannel = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { channelName } = req.body;
    if (!channelName) {
        return res.status(400).json({ message: "Channel name is required" });
    }
    try {
        const workspace = await Workspace.findById(req.params._id);
        if (!workspace) {
            return res.status(404).json({ message: "No workspace found with Id" });
        }
        const newChannel = new Channel({
            channelName,
            workspace: { _id: workspace._id, workspaceName: workspace.workspace },
            admin: userId,
        });
        await newChannel.save();
        workspace.channels.push({
            _id: newChannel._id,
            channelName: newChannel.channelName,
        });
        await workspace.save();

        // Invalidate relevant cache entries
        channelCache.del(`latestChannel:${userId}`);
        channelCache.del(`channels:${userId}`);
        channelCache.del(`channelById:${userId}:${newChannel._id}`);

        return res.status(201).json({ message: "Channel Created", newChannel });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

exports.updateChannel = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const admin = req.user._id;
    const updatedChannelName = req.body.channelName;
    if (!updatedChannelName) {
        return res.status(400).json({ message: "Please provide a channel name" });
    }
    try {
        const channel = await Channel.findOne({ _id, admin });
        if (!channel) {
            return res.status(401).json({ message: "Unauthorized to update this" });
        }
        const options = { new: true };
        const result = await Channel.findByIdAndUpdate(
            _id,
            { channelName: updatedChannelName },
            options
        );

        // Invalidate relevant cache entries
        channelCache.del(`latestChannel:${admin}`);
        channelCache.del(`channels:${admin}`);
        channelCache.del(`channelById:${admin}:${_id}`);

        return res.status(200).json({ message: "Channel name updated!", result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Internal server error ${err}` });
    }
});

exports.deleteChannel = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const admin = req.user._id;
    try {
        const channel = await Channel.findOne({ _id, admin });
        if (!channel) {
            return res.status(403).json({ message: "Unauthorized to delete the channel" });
        }
        const deleted = await Channel.findByIdAndDelete(_id);

        // Invalidate relevant cache entries
        channelCache.del(`latestChannel:${admin}`);
        channelCache.del(`channels:${admin}`);
        channelCache.del(`channelById:${admin}:${_id}`);

        return res.status(200).json({ message: "Channel deleted", deleted });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Internal server error ${err}` });
    }
});
