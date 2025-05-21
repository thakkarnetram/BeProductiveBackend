const express = require("express");
const authController = require("../../controllers/user-auth/authController");
const rateLimiter = require('../../utils/rate-limiting/authRateLimiter')

const router = express.Router();

router.route("/api/v1/signup").post(rateLimiter.registerLimit, authController.signup);
router.route("/api/v1/login").post(rateLimiter.loginLimit, authController.login);
// router.route("/api/v1/google").post(authController.googleAuth);
router.route("/api/v1/verify").get(rateLimiter.verifyEmailLimit, authController.verifyEmail);
router.route("/api/v1/reset").post(rateLimiter.resetPasswordGenerateLinkLimit, authController.resetPasswordLink);
router
    .route("/api/v1/reset/:_id")
    .get(rateLimiter.resetPasswordPageLimit, authController.resetPassword)
    .post(rateLimiter.resetPasswordUpdatingLimit, authController.handlePasswordReset);
router
    .route("/api/v1/fcm")
    .post(authController.protect,authController.addFcmToken);

module.exports = router;
