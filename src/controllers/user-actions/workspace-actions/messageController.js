const Message = require("../../../models/Message");
const redis = require("../../../utils/caching-handler/redisClient");
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

// MESSAGE SECTION
exports.getChannelMessageById = asyncErrorHandler(async (req, res, next) => {
    const { channel } = req.params;
    const cacheKey = `messages:${channel}`;
    if (!channel) {
        return res.status(400).json({ message: "Channel Id not found" });
    }
    try {
        if(!redis.isReady) {
            console.warn('Redis is not ready')
        } else {
            const channelMessages = await redis.get(cacheKey);
            if(channelMessages) {
                return res.status(200).json(JSON.parse(channelMessages))
            }
        }
        const messages = await Message.find({ channel });
        if (!messages) {
            return res
                .status(404)
                .json({ message: "No Messages found in the channel" });
        } else {
            await redis.setEx(cacheKey,3600,JSON.stringify(messages))
            return res.status(200).json(messages);
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});
