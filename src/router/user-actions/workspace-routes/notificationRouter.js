const express = require('express');
const notificationController = require("../../../controllers/user-actions/workspace-actions/notificationController")
const authController = require('../../../controllers/user-auth/authController')
const router = express.Router();

router
    .route("/api/v1/general")
    .get(authController.protect, notificationController.getGeneralNotifications)
router
    .route("/api/v1/mentions")
    .get(authController.protect,notificationController.getMentionedNotifications)


module.exports = router;
