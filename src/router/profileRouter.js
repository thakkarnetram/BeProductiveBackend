const express = require('express');
const profileController = require('../controllers/profileController');
const authController = require('../controllers/authController');

const router = express.Router();

// Profile routes 
router
    .route("/api/v1/profile/:_id")
    .get(authController.protect,profileController.getProfileData)

module.exports = router;