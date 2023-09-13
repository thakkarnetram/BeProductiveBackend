const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/api/v1/signup").post(authController.signup);
router.route("/api/v1/login").post(authController.login);
// router.route("/api/v1/google").post(authController.googleAuth);
router.route("/api/v1/verify").get(authController.verifyEmail);
router.route("/api/v1/reset").post(authController.resetPasswordLink);
router
  .route("/api/v1/reset/:_id")
  .get(authController.resetPassword)
  .post(authController.handlePasswordReset);


module.exports = router;
