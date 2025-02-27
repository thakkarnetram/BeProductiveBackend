const express = require("express");
const channelController = require("../../../controllers/user-actions/workspace-actions/channelController");
const authController = require("../../../controllers/user-auth/authController");
const channelLimiter = require('../../../utils/rate-limiting/workSpaceRateLimiter')

const router = express.Router();

// CHANNELS
router
    .route("/api/v1/channels")
    .get(channelLimiter.getChannelLimit, authController.protect, channelController.getChannels);
router
    .route("/api/v1/channel/:_id")
    .get(channelLimiter.getChannelLimit, authController.protect, channelController.getChannelById);
router
    .route("/api/v1/channel/latest")
    .get(channelLimiter.getChannelLimit, authController.protect, channelController.getLatestChannel);
router
    .route("/api/v1/channel/add/:_id")
    .post(channelLimiter.addChannelLimit, authController.protect, channelController.createChannel);
router
    .route("/api/v1/channel/update/:_id")
    .put(channelLimiter.getChannelLimit, authController.protect, channelController.updateChannel);
router
    .route("/api/v1/channel/delete/:_id")
    .delete(channelLimiter.getChannelLimit, authController.protect, channelController.deleteChannel);

module.exports = router;
