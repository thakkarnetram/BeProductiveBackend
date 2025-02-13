const express = require('express');
const profileController = require('../../../controllers/user-actions/profilespace-actions/profileController');
const authController = require('../../../controllers/user-auth/authController');

const router = express.Router();

// Profile routes
router
    .route("/api/v1/profile/:_id")
    .get(authController.protect,profileController.getProfileData)

module.exports = router;
