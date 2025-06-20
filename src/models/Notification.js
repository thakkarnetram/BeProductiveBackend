const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        ref:"users"
    },
    type:{
        type:String,
        enum:["mention","message","system"],
        default:"message"
    },
    title: {
        type:String
    },
    body: {
        type:String
    },
    data: {
        type:Object
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("notifications",notificationSchema)
