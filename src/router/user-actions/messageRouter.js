const express = require("express");
const messageController = require("../../controllers/user-actions/messageController");
const authController = require("../../controllers/user-auth/authController");

const router = express.Router();

// MESSAGES
router
  .route("/api/v1/message/:channel")
  .get(authController.protect, messageController.getChannelMessageById);

module.exports = router;
