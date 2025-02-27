const Workspace = require("../../../models/Workspace");
const Channel = require("../../../models/Channel");
const NodeCache = require("node-cache");
const channelCache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 1600
});

const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");
const {async} = require("seed");

// CHANNEL SECTION
exports.getChannels = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    if (!userId) {
        return res.status(400).json({message: "User ID not found"});
    }
    try {
        let channels;
        channels = await Channel.find({
            $or: [
                {admin: userId}, // Channels where the user is the admin
                {members: userId}, // Channels where the user is a member
            ],
        });
        if (!channels || channels.length === 0) {
            return res
                .status(404)
                .json({message: "No channels found! Create one."});
        }
        if (channelCache.has(`channels:${userId}`)) {
            channels = JSON.parse(channelCache.get(`channels:${userId}`))
        } else {
            channelCache.set(`channels:${userId}`, JSON.stringify(channels))
        }
        return res.status(200).json(channels);
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
});

exports.getChannelById = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const channelId = req.params._id;
    if (!userId) {
        return res.status(400).json({message: "User ID not found"});
    }
    try {
        let findChannel;
        findChannel = await Channel.findById(channelId);
        if (!findChannel) {
            return res.status(404).json({message: "Channel not found"});
        }
        if (channelCache.has(`channelById:${userId}`)) {
            findChannel = JSON.parse(channelCache.get(`channelById:${userId}`))
        } else {
            channelCache.set(`channelById${userId}`, JSON.stringify(findChannel))
        }
        // Check if the uscoer is either the admin or a member of the channel
        if (
            findChannel.admin.toString() !== userId &&
            !findChannel.members.includes(userId)
        ) {
            return res.status(403).json({message: "Permission denied"});
        }
        return res.status(200).json(findChannel);
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
});

exports.getLatestChannel = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    // Find the latest workspace for the specific user
    try {
        let latestChannel;
        latestChannel = await Channel.find({
            $or: [
                {admin: userId}, // Channels where the user is the admin
                {members: userId}, // Channels where the user is a member
            ],
        })
            .sort({createdAt: -1})
            .limit(2);

        if (!latestChannel) {
            return res.status(404).json({message: "No Channel found"});
        }
        if (channelCache.has(`latestChannel:${userId}`)) {
            latestChannel = JSON.parse(channelCache.get(`latestChannel:$userId`))
        } else {
            channelCache.set(`latestChannel:${userId}`, JSON.stringify(latestChannel))
        }
        return res.status(200).json(latestChannel);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
});

exports.createChannel = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;
    const {channelName} = req.body;

    if (!channelName) {
        return res.status(400).json({message: "Channel name is required"});
    }
    try {
        const workspace = await Workspace.findById({_id: req.params._id});
        if (!workspace) {
            return res.status(404).json({message: "No workspace found with Id"});
        }
        // Create a new channel based on the request body
        const newChannel = new Channel({
            channelName,
            workspace: {_id: workspace._id, workspaceName: workspace.workspace},
            admin: userId,
        });
        await newChannel.save();
        workspace.channels.push({
            _id: newChannel._id,
            channelName: newChannel.channelName,
        });
        channelCache.del(`latestChannel:${userId}`);
        channelCache.del(`channels:${userId}`);
        channelCache.del(`channelById:${userId}`);
        await workspace.save();
        return res.status(201).json({message: "Channel Created", newChannel});
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
});

exports.updateChannel = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const admin = req.user._id;
    const updatedChannel = req.body;
    if (!updatedChannel) {
        return res.status(400).json({message: "Please provide a channel name"})
    }
    try {
        const channel = await Channel.findOne({_id, admin})
        if (!channel) {
            return res.status(401).json({message: 'Unauthorized to update this'})
        }
        const options = {new: true};
        const result = await Channel.findByIdAndUpdate(
            _id,
            {channelName: updatedChannel},
            options
        )
        channelCache.del(`latestChannel:${admin}`)
        channelCache.del(`channels:${admin}`)
        channelCache.del(`channelById:${admin}`)
        return res.status(200).json({message: 'Channel name updated !', result})

    } catch (err) {
        return res.status(500).json({message: `Internal server error ${err}`})
    }
})

exports.deleteChannel = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const admin = req.user._id;
    try {
        const findSpace = await Channel.findOne({_id, admin});
        if (!findSpace) {
            return res.status(403).json({message: 'Unauthorized to delete the channel'})
        }
        const deleteSpace = await Channel.findByIdAndDelete({_id, admin});
        channelCache.del(`latestChannel:${admin}`)
        channelCache.del(`channels:${admin}`)
        channelCache.del(`channelById:${admin}`)
        return res.status(200).json({message: "Channel deleted ", deleteSpace})
    } catch (err) {
        return res.status(501).json({message: `Internal server error ${err}`})
    }
})
