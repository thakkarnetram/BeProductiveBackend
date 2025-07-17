const Notification = require("../../../models/Notification")
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

exports.getGeneralNotifications = asyncErrorHandler(async (req,res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            return res.status(404).json({message:"User id must be provided"})
        }
        const notifications =  await Notification.find({receiverId: userId,notificationType: "message",});
        return res.status(200).json({notifications})
    } catch (err) {
        return res.status(500).json({message:`Internal Server Error ${err}`})
    }
})

exports.getMentionedNotifications = asyncErrorHandler(async (req,res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            return res.status(404).json({message:"User id must be provided"})
        }
        const notifications =  await Notification.find({receiverId: userId,notificationType: "mention",});
        return res.status(200).json({notifications})
    } catch (err) {
        return res.status(500).json({message:`Internal Server Error ${err}`})
    }
})


