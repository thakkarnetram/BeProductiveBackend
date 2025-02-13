const express = require("express");
const channelController = require("../../../controllers/user-actions/workspace-actions/channelController");
const authController = require("../../../controllers/user-auth/authController");

const router = express.Router();

// CHANNELS
router
  .route("/api/v1/channels")
  .get(authController.protect, channelController.getChannels);
router
  .route("/api/v1/channel/:_id")
  .get(authController.protect, channelController.getChannelById);
router
  .route("/api/v1/channel/latest")
  .get(authController.protect, channelController.getLatestChannel);
router
  .route("/api/v1/channel/add/:_id")
  .post(authController.protect, channelController.createChannel);

module.exports = router;
