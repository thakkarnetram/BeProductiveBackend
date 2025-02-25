const express = require("express");
const messageController = require("../../../controllers/user-actions/workspace-actions/messageController");
const authController = require("../../../controllers/user-auth/authController");
const messageLimiter = require('../../../utils/rate-limiting/workSpaceRateLimiter')

const router = express.Router();

// MESSAGES
router
    .route("/api/v1/message/:channel")
    .get(messageLimiter.messageLimit, authController.protect, messageController.getChannelMessageById);

module.exports = router;
