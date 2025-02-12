const express = require('express')
const authController = require('../../controllers/user-auth/authController')
const otpController = require("../../controllers/user-auth/otpController");

const router = express.Router();

router.route('/otp').post(otpController.createOtpAndSend)
router.route('/otp/login').post(authController.loginUsingOtp);

module.exports= router;
