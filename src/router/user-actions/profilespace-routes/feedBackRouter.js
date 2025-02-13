const express = require("express");
const feedBackController = require("../../../controllers/user-actions/profilespace-actions/feedBackController");
const authController = require("../../../controllers/user-auth/authController");

const router = express.Router();

// FEEDBACK
router
  .route("/api/v1/feedback")
  .post(authController.protect, feedBackController.addFeedback);

module.exports = router;
