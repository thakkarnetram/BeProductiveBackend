const express = require("express");
const inviteController = require("../controllers/inviteController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/api/v1/:workspaceId")
  .get(authController.protect, inviteController.generateInviteLink);
router
  .route("/api/v1/:workspaceId")
  .post(authController.protect, inviteController.joinWorkspace);

module.exports = router;
