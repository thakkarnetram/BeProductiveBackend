const mongoose = require("mongoose");
const shortid = require("shortid");

const feedbackSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
});

const Feedback = mongoose.model("feedbacks", feedbackSchema);

module.exports = Feedback;