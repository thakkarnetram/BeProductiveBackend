const express = require('express')
const authController = require('../../controllers/user-auth/authController')
const otpController = require("../../controllers/user-auth/otpController");
const otpLimiter = require('../../utils/rate-limiting/authRateLimiter')

const router = express.Router();

router.route('/otp').post(otpLimiter.requestingOtpLimiter, otpController.createOtpAndSend)
router.route('/otp/login').post(otpLimiter.sendingOtpLimiter, authController.loginUsingOtp);

module.exports = router;
