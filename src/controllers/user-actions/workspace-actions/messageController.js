const Message = require("../../../models/Message");
const NodeCache = require("node-cache");
const messageCache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 1600
});
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

// MESSAGE SECTION
exports.getChannelMessageById = asyncErrorHandler(async (req, res, next) => {
    const {channel} = req.params;
    if (!channel) {
        return res.status(400).json({message: "Channel Id not found"});
    }
    try {
        let messages;
        messages = await Message.find({channel});
        if (messageCache.has(`messages:${channel}`)) {
            messages = JSON.parse(messageCache.get(`messages:${channel}`))
        } else {
            messageCache.set(`messages:${channel}`, JSON.stringify(messages))
        }
        if (!messages) {
            return res
                .status(404)
                .json({message: "No Messages found in the channel"});
        }
        return res.status(200).json(messages);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
});
