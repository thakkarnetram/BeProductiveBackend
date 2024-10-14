const express = require("express");
const actionController = require("../controllers/actionController");
const authController = require("../controllers/authController");

const router = express.Router();

// FEEDBACK
router
  .route("/api/v1/feedback")
  .post(authController.protect, actionController.addFeedback);

module.exports = router;
