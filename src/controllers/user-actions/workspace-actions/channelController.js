const Workspace = require("../../../models/Workspace");
const Channel = require("../../../models/Channel");
const redis = require("../../../utils/caching-handler/redisClient");
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

// CHANNEL SECTION
exports.getChannels = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const cacheKey = `channels:${userId}`;
    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }
    try {
        if(!redis.isReady) {
            console.warn('Redis client not open')
        } else {
            const cachedChannels = await redis.get(cacheKey);
            if(cachedChannels) {
                return res.status(200).json(JSON.parse(cachedChannels));
            }
        }
        const channels = await Channel.find({
            $or: [
                { admin: userId }, // Channels where the user is the admin
                { members: userId }, // Channels where the user is a member
            ],
        });
        if (!channels || channels.length === 0) {
            return res
                .status(404)
                .json({ message: "No channels found! Create one." });
        }
        await redis.setEx(cacheKey,3600,JSON.stringify(channels));
        return res.status(200).json(channels);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

exports.getChannelById = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const channelId = req.params._id;
    const cacheKey = `channelById:${userId}`;
    if (!userId) {
        return res.status(400).json({ message: "User ID not found" });
    }
    try {
        if(!redis.isReady) {
            console.warn('Redis client not open')
        } else {
            const cachedChannel = await redis.get(cacheKey);
            if(cachedChannel) {
                return res.status(200).json(JSON.parse(cachedChannel))
            }
        }
        const findChannel = await Channel.findById(channelId);
        if (!findChannel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Check if the uscoer is either the admin or a member of the channel
        if (
            findChannel.admin.toString() !== userId &&
            !findChannel.members.includes(userId)
        ) {
            return res.status(403).json({ message: "Permission denied" });
        }
        await redis.setEx(cacheKey,3600,JSON.stringify(findChannel))
        return res.status(200).json(findChannel);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

exports.getLatestChannel = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const cacheKey = `latestChannel:${userId}`;
    // Find the latest workspace for the specific user
    try {
        if(!redis.isReady) {
            console.warn('Redis client not open')
        } else {
            const latestChannel = await redis.get(cacheKey);
            if(latestChannel) {
                return res.status(200).json(JSON.parse(latestChannel))
            }
        }
        const latestChannel = await Channel.find({
            $or: [
                { admin: userId }, // Channels where the user is the admin
                { members: userId }, // Channels where the user is a member
            ],
        })
            .sort({ createdAt: -1 })
            .limit(2);

        if (!latestChannel) {
            return res.status(404).json({ message: "No Channel found" });
        }
        await redis.setEx(cacheKey,3600,JSON.stringify(latestChannel))
        return res.status(200).json(latestChannel);
    } catch (e) {
        console.log(e);
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
        const workspace = await Workspace.findById({ _id: req.params._id });
        if (!workspace) {
            return res.status(404).json({ message: "No workspace found with Id" });
        }
        // Create a new channel based on the request body
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
        await redis.del( `latestChannel:${userId}`);
        await redis.del( `channels:${userId}`);
        await redis.del( `channelById:${userId}`);
        await workspace.save();
        return res.status(201).json({ message: "Channel Created", newChannel });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// TODO DELETE AND UPDATE CHANNELS
