const express = require("express");
const actionController = require("../controllers/actionController");
const authController = require("../controllers/authController");

const router = express.Router();

// MESSAGES
router
  .route("/api/v1/message/:channel")
  .get(authController.protect, actionController.getChannelMessageById);

module.exports = router;
