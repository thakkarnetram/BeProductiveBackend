const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    senderId:{
      type:String,
      ref:"users"
    },
    senderName:{
        type:String,
        required:true,
    },
    channelName : {
        type:String,
        required:true
    },
    channelId : {
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    receiverId:{
        type:String,
        ref:"users",
        required:true
    },
    notificationType:{
        type:String,
        enum:["mention","message"],
        required:true
    },
    createdAt:{
        type: String,
        default: () => new Date().toLocaleTimeString(),
    }
})

module.exports = mongoose.model("notifications",notificationSchema)
