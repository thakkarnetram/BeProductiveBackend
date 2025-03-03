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
    const {name} = req.user;
    if (!channel) {
        return res.status(400).json({message: "Channel Id not found"});
    }
    try {
        let messages;
        messages = await Message.find({channel});
        if (messageCache.has(`messages:${channel}`)) {
            messages = JSON.parse(messageCache.get(`messages:${name}`))
        } else {
            messageCache.set(`messages:${name}`, JSON.stringify(messages))
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

exports.getMessageByUser = asyncErrorHandler(async (req, res, next) => {
    const {channel} = req.params;
    const {name} = req.user;
    if (!channel) {
        return res.status(404).json({message: "Channel not found"})
    }
    try {
        let messages;
        messages = await Message.find({sentBy: name, channel})
        if (messageCache.has(`messageByUser:${name}`)) {
            messages = JSON.parse(messageCache.get(`messageByUser:${name}`))
        } else {
            messageCache.set(`messageByUser:${name}`, JSON.stringify(messages))
        }
        if (!messages) {
            return res
                .status(404)
                .json({message: "No Messages found by the user"});
        }
        return res.status(200).json(messages)
    } catch (err) {
        return res.status(501).json({message: `Internal server error ${err}`})
    }
})

exports.editMessage = asyncErrorHandler(async (req, res, next) => {
    const {messageId} = req.params;
    const {name} = req.user;
    const {updatedMessage} = req.body;
    if (!messageId) {
        return res.status(404).json({message: "Message not found"})
    }
    if (!updatedMessage) {
        return res.status(404).json({message: "Please provided a message"})
    }
    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({message: "Message with the given id not found"})
        }
        if (message.sentBy !== name) {
            return res.status(403).json({message: "You can only edit your own messages"})
        }
        const options = {new: true};
        const update = await Message.findByIdAndUpdate(
            {_id: messageId},
            {text: updatedMessage},
            options
        );
        messageCache.del(`messageByUser:${name}`)
        messageCache.del(`messages:${name}`)
        return res.status(200).json(update)
    } catch (err) {
        return res.status(501).json({message: `Internal server error ${err}`})
    }
})

exports.deleteMessage = asyncErrorHandler(async (req, res, next) => {
    const {messageId} = req.params;
    const {name} = req.user;
    try {
        const message = await Message.findById({_id: messageId})
        if (!message) {
            return res.status(404).json({message: "Message not found"})
        }
        if (message.sentBy !== name) {
            return res.status(403).json({message: "Unauthorized to delete this "})
        }
        const deleteMessage = await Message.findByIdAndDelete({_id: messageId})
        messageCache.del(`messageByUser:${name}`)
        messageCache.del(`messages:${name}`)
        return res.status(200).json({message: "Message deleted", deleteMessage})
    } catch (err) {
        return res.status(501).json({message: `Internal server error ${err}`})
    }
})
