const User = require("../../models/User");
const Otp = require("../../models/Otp")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const nodemailer = require("nodemailer");
const sendEmails = require("../../utils/email-handler/emailSender");
const {sign} = require("jsonwebtoken");

require("dotenv").config({path: `.env.${process.env.NODE_ENV}`});

exports.signToken = (email) => {
    return jwt.sign(
        {
            email,
        },
        process.env.SECRET_KEY
    );
};

const signToken = (email) => {
    return jwt.sign(
        {
            email,
        },
        process.env.SECRET_KEY
    );
};

exports.signup = async (req, res) => {
    try {
        const {name, username, email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Validation
        if (!name || !username || !email || !password) {
            return res.status(400).json({message: "ALL FIELDS ARE REQUIRED"});
        } else if (!emailRegex.test(email)) {
            return res.status(400).json({message: "EMAIL FORMAT IS INVALID"});
        }
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res
                .status(400)
                .json({message: "Email already exists, please login."});
        }
        // Check if username already exists
        const existingUserName = await User.findOne({username});
        if (existingUserName) {
            return res
                .status(400)
                .json({
                    message: "Username already exists , choose a different one ! ",
                });
        }
        // Hash the password
        const hash = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({
            name,
            username,
            email,
            password: hash,
        });
        await newUser.save();
        // Send verification email
        await sendEmails.verifyEmail(email);
        return res.status(201).json({
            message: "User Created! Please check your email to verify.",
            user: newUser,
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

exports.login = async (req, res) => {
    try {
        // Inputs
        const {email, password} = req.body;
        // Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Validation
        if (!(email && password)) {
            return res
                .status(400)
                .json({message: "Email & Password cannot be empty"});
        } else if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid Email format"});
        }
        // Finding the user from the database
        const user = await User.findOne({email});
        // If user is not found, return 401
        if (!user) {
            return res.status(401).json({message: "Email not found !"});
        }
        // If user is not verified, return 401
        if (!user.isEmailVerified) {
            return res.status(401).json({message: "User Not Verified"});
        }
        // Compare passwords using bcrypt
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) {
            // Returning the token
            const token = signToken(user.email);
            return res.status(200).json({
                message: "Login Successful",
                token,
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            });
        } else {
            // Invalid password
            return res.status(401).json({message: "Invalid password"});
        }
    } catch (error) {
        // Handling internal server error
        res.status(500).json({message: "Internal Server Error"});
    }
};

exports.loginUsingOtp = async (req, res) => {
    try {
        const {otp} = req.body;
        if (!otp) {
            return res.status(403).json({message: "Please enter otp"})
        }
        const otpRecord = await Otp.findOne({otp});
        if (!otpRecord) {
            return res.status(404).json({message: "Invalid Otp"})
        }
        if (otpRecord.isUsed) {
            return res.status(403).json({message: "Otp already used"})
        }
        otpRecord.isUsed = true;
        await otpRecord.save();
        return res.status(200).json({message: "Otp verified successfully"})
    } catch (error) {
        return res.status(500).json({message: `Internal Server Error ${error}`})
    }
}

exports.verifyEmail = async (req, res) => {
    const {email} = req.query;
    if (!email) {
        return res.status(401).json({message: "Email not found"});
    }
    try {
        const user = await User.findOneAndUpdate(
            {email},
            {isEmailVerified: true}
        );
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        if (user) {
            return res.status(200).render("verified.ejs");
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({message: "Internal Server Error", error});
    }
};

exports.resetPasswordLink = async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(400).json({message: "Email not provided"});
        }
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const link = `${process.env.ROOT_URL_KOYEB}/auth/api/v1/reset/${user._id}`;
        await sendEmails.resetEmail(user.email, link);
        return res
            .status(200)
            .json({message: `Password Reset Email Sent To ${email}`});
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res
            .status(500)
            .json({message: "An internal server error occurred"});
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params._id);
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        // Render the ResetPasswordPage.ejs template with userId and token
        res.render("reset.ejs", {
            userId: req.params._id,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error", error});
    }
};

exports.handlePasswordReset = async (req, res) => {
    try {
        console.log(req.body); // Log the entire request body
        const user = await User.findById(req.params._id);
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        const newPassword = req.body.newPassword;
        // Check if newPassword is a non-empty string
        if (!newPassword) {
            return res.status(404).json({message: "Provide a valid password"});
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        // Redirect to a success page or display a success message
        return res.render("success.ejs");
    } catch (error) {
        console.log(error);
        return res.render("fail.ejs");
    }
};

exports.getUserNameById = async (req,res) => {
    try {
        const {userIds} = req.body;
        if (!Array.isArray(userIds)) {
            return res.status(400).json({message:"User Id should be an array"})
        }
        const users = await User.find(
            { _id: { $in: userIds } },
            '_id username name'
        );
        return res.status(200).json(users)
    } catch (err) {
        return res.status(501).json({message: err})
    }
}

exports.addFcmToken = async (req, res) => {
    try {
        const {fcm} = req.body;
        const userId = req.user._id;
        if (!fcm) {
            return res.status(404).json({message: 'FCM Token is required'})
        }
        const user = await User.findOneAndUpdate(
            {_id: userId},
            {$addToSet: {fcmTokens: fcm}},
            {new: true, runValidators: true}
        )

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({ message: "FCM token saved", fcmToken: user.fcmToken });

    } catch (err) {
        return res.status(501).json({message: err})
    }
};

exports.removeFcmToken = async  (req,res ) => {
    try {
        const {token} = req.body;
        if (!token) {
            return res.status(400).json({message:"Token is required"})
        }
        const userId = req.user._id;
        await User.updateOne(
            {
                _id: userId,
            },
            {
                $pull : {
                    fcmTokens:token
                }
            }
        )
        return res.status(200).json({message:"Token Removed "})
    } catch (err) {
        return res.status(501).json({message:err})
    }
}


exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        let jwtToken;
        // If no token is provided
        if (!token) {
            return res.status(401).json({message: "No Token Found"});
        }
        if (token && token.startsWith("Bearer ")) {
            jwtToken = token.split(" ")[1];
        }
        // Validate and decode the token
        const decodedToken = await util.promisify(jwt.verify)(
            jwtToken,
            process.env.SECRET_KEY
        );

        // Check if user exists
        const user = await User.findOne({email: decodedToken.email});

        if (!user) {
            return res
                .status(404)
                .json({message: "The user with the given token does not exist"});
        }

        // Attach the user information to the request object for later use
        req.user = user;
        // console.log(JSON.stringify(req.user));

        // Continue to the next middleware
        next();
    } catch (error) {
        res.status(401).json({message: error.message});
    }
};
