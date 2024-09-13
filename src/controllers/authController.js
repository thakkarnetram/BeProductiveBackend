const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const nodemailer = require("nodemailer");
const sendEmails = require("../utils/emailSender");
const { sign } = require("jsonwebtoken");
const constants = require("../constants/constants");
const ROOT_URL = constants.ROOT_URL;
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

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

// exports.googleAuth = async (req, res) => {
//   try {
//     const { token } = req.body;
//     if (!token) {
//       return res.status(404).json({ message: "No token found" });
//     }
//     console.log("Received token:", token);

//     const googleToken = await admin.auth().verifyIdToken(token);
//     console.log("Google Token:", googleToken);

//     const googleEmail = googleToken.email;
//     console.log("Google Email:", googleEmail);

//     let user = await User.findOne({ email: googleEmail });
//     console.log("User:", user);

//     if (!user) {
//       user = new User({ email: googleEmail, isGoogleAuth: true });
//       await user.save();
//     }

//     const newToken = signToken(user.email);
//     console.log("New Token:", newToken);

//     return res.status(200).json({ token: newToken });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "ALL FIELDS ARE REQUIRED" });
    } else if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "EMAIL FORMAT IS INVALID" });
    } else if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain 6 characters: 1 Uppercase, 1 Number, 1 Special Char",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please login." });
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
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    // Inputs
    const { email, password } = req.body;
    // Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validation
    if (!(email && password)) {
      return res
        .status(400)
        .json({ message: "Email & Password cannot be empty" });
    } else if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid Email format" });
    }
    // Finding the user from the database
    const user = await User.findOne({ email });
    // If user is not found, return 401
    if (!user) {
      return res.status(401).json({ message: "Email not found !" });
    }
    // If user is not verified, return 401
    if (!user.isEmailVerified) {
      return res.status(401).json({ message: "User Not Verified" });
    }
    // Compare passwords using bcrypt
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch) {
      // Returning the token
      const token = signToken(user.email);
      return res.status(200).json({ message: "Login Successful", token });
    } else {
      // Invalid password
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    // Handling internal server error
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(401).json({ message: "Email not found" });
  }
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user) {
      return res.status(200).render("verified.ejs");
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.resetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email not provided" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const link = `${ROOT_URL}/auth/api/v1/reset/${user._id}`;
    await sendEmails.resetEmail(user.email, link);
    return res
      .status(200)
      .json({ message: `Password Reset Email Sent To ${email}` });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    // Render the ResetPasswordPage.ejs template with userId and token
    res.render("reset.ejs", {
      userId: req.params._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error });
  }
};

exports.handlePasswordReset = async (req, res) => {
  try {
    console.log(req.body); // Log the entire request body
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const newPassword = req.body.newPassword;
    // Check if newPassword is a non-empty string
    if (!newPassword) {
      return res.status(404).json({ message: "Provide a valid password" });
    }
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    // Check if newPassword meets the strong password requirements
    if (!strongPasswordRegex.test(newPassword.trim())) {
      return res
        .status(401)
        .json({ message: "Password must be 6 chars and meet requirements" });
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

// middleware
// exports.protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     // let jwtToken;
//     // If no token is provided
//     if (!token) {
//       return res.status(401).json({ message: "No Token Found" });
//     }
//     if (token && token.startsWith("Bearer ")) {
//       // jwtToken = token.split(" ")[1];
//       try {
//         const googleToken = await admin.auth.verifyIdToken(token.split(" ")[1]);
//         const email = googleToken.email;

//         // find user
//         const user = await User.findOne({ email });
//         // if token invalid return
//         if (!user) {
//           return res
//             .status(404)
//             .json({ message: "Provided Details are invalid" });
//         }
//         // sending the user obj
//         req.user = user;
//         next();
//       } catch (error) {
//         res.status(401).json({ message: "Invalid token ", error });
//       }
//     } else {
//       try {
//         // regular tokens
//         const jwtToken = token;
//         const decodedToken = await util.promisify(jwt.verify)(
//           jwtToken,
//           process.env.SECRET_KEY
//         );
//         // user checking if there
//         const user = await User.findOne({ email });
//         //  if mot there return 404
//         if (!user) {
//           return res.status(404).json({ message: "Invalid details " });
//         }
//         // attach the user obj
//         req.user = user;
//         next();
//       } catch (error) {
//         res.status(401).json({ message: "Invalid Details of token ", error });
//       }
//     }
//     // Validate and decode the token
//     // const decodedToken = await util.promisify(jwt.verify)(
//     //   jwtToken,
//     //   process.env.SECRET_KEY
//     // );
//     // Check if user exists
//     // const user = await User.findOne({ email: decodedToken.email });
//     // if (!user) {
//     //   return res
//     //     .status(404)
//     //     .json({ message: "The user with the given token does not exist" });
//     // }
//     // Attach the user information to the request object for later use
//     // req.user = user;
//     // Continue to the next middleware
//     // next();
//   } catch (error) {
//     res.status(401).json({ message: error.message });
//   }
// };

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let jwtToken;
    // If no token is provided
    if (!token) {
      return res.status(401).json({ message: "No Token Found" });
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
    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "The user with the given token does not exist" });
    }

    // Attach the user information to the request object for later use
    req.user = user;
    // console.log(JSON.stringify(req.user));

    // Continue to the next middleware
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
