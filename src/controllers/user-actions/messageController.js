const Message = require("../../models/Message");
const asyncErrorHandler = require("../../utils/AsyncErrorHandler");

// MESSAGE SECTION
exports.getChannelMessageById = asyncErrorHandler(async (req, res, next) => {
    const { channel } = req.params;
    if (!channel) {
        return res.status(400).json({ message: "Channel Id not found" });
    }
    try {
        const messages = await Message.find({ channel });

        if (!messages) {
            return res
                .status(404)
                .json({ message: "No Messages found in the channel" });
        } else {
            return res.status(200).json(messages);
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});
