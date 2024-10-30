const express = require('express')
const authController = require('../controllers/authController')
const otpController = require("../controllers/otpController");

const router = express.Router();

router.route('/otp').post(otpController.createOtpAndSend)
router.route('/otp/login').post(authController.loginUsingOtp);

module.exports= router;