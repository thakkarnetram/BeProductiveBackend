const express = require("express");
const messageController = require("../../../controllers/user-actions/workspace-actions/messageController");
const authController = require("../../../controllers/user-auth/authController");
const messageLimiter = require('../../../utils/rate-limiting/workSpaceRateLimiter')

const router = express.Router();

// MESSAGES
router
    .route("/api/v1/message/:channel")
    .get(messageLimiter.messageLimit, authController.protect, messageController.getChannelMessageById);
router
    .route("/api/v1/message/user/:channel")
    .get(messageLimiter.messageLimit, authController.protect, messageController.getMessageByUser);
router
    .route("/api/v1/message/user/:messageId")
    .put(messageLimiter.messageLimit, authController.protect, messageController.editMessage);
router
    .route("/api/v1/message/user/:messageId")
    .delete(messageLimiter.messageLimit, authController.protect, messageController.editMessage);
module.exports = router;
