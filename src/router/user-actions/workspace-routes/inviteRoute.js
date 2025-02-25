const express = require("express");
const inviteController = require("../../../controllers/user-actions/workspace-actions/inviteController");
const authController = require("../../../controllers/user-auth/authController");
const inviteLimiter = require('../../../utils/rate-limiting/workSpaceRateLimiter')

const router = express.Router();

router
    .route("/api/v1/:workspaceId")
    .get(inviteLimiter.inviteLimit, authController.protect, inviteController.generateInviteLink);
router
    .route("/api/v1/:workspaceId")
    .post(inviteLimiter.joinSpaceLimit, authController.protect, inviteController.joinWorkspace);

module.exports = router;
