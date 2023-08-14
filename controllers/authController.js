const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');

const signToken = email => {
  return jwt.sign(
    {
      email,
    },
    process.env.SECRET_KEY,
  );
};

exports.signup = async (req, res) => {
  try {
    // inputs
    const {name, username, email, password} = req.body;
    //regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    //validation
    if (!(name && username && email && password)) {
      return res.status(400).json({message: 'ALL FIELDS ARE REQUIRED'});
    } else if (!emailRegex.test(email)) {
      return res.status(400).json({message: 'EMAIL FORMAT IS INVALID '});
    } else if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must contain 6 characters : 1 Uppercase , 1 Number , 1 Special Char',
      });
    }
    // checking if user exists
    const oldUser = await User.findOne({email});
    if (oldUser) {
      return res
        .status(400)
        .json({message: 'Email already exists , Please Login '});
    }

    // hashing the password
    const hash = await bcrypt.hash(password, 10);
    // creating object
    const user = new User({
      name: name,
      username: username,
      email: email,
      password: hash,
    });

    // jwt token for authorization .
    const token = signToken(user.email);
    // save the token
    user.token = token;
    await User.create(user);
    return res
      .status(201)
      .json({message: 'User Created ! Login Now', token, user});
  } catch (error) {
    res.status(500).json({message: 'Internal Server Error'});
  }
};

exports.login = async (req, res) => {
  try {
    //inputs
    const {email, password} = req.body;
    //regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //validation
    if (!(email && password)) {
      return res
        .status(400)
        .json({message: 'Email & Password cannot be empty'});
    } else if (!emailRegex.test(email)) {
      return res.status(400).json({message: 'Invalid Email format'});
    }
    // finding the user from db
    const user = await User.findOne({email});
    // checking if user is there give OK
    if (user && (await bcrypt.compare(password, user.password))) {
      // create a new token if the match is found
      const token = signToken(user.email);
      // assign and save the token\
      user.token = token;
      // returning the token
      return res.status(200).json({message: 'Login Successful', token, user});
    }
    // if nothing matches return 401
    if (!user) {
      return res.status(401).json({message: 'Invalid Login Credentials'});
    }
  } catch (error) {
    // handling internal server error
    res.status(500).json({message: 'Internal Server Error'});
  }
};

// middleware
exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let jwtToken;
    // If no token is provided
    if (!token) {
      return res.status(401).json({message: 'No Token Found'});
    }
    if (token && token.startsWith('Bearer ')) {
      jwtToken = token.split(' ')[1];
    }
    console.log('TOKENNNNNNN ' + jwtToken);

    // Validate and decode the token
    const decodedToken = await util.promisify(jwt.verify)(
      jwtToken,
      process.env.SECRET_KEY,
    );
    console.log('DECODED TOKEN ' + JSON.stringify(decodedToken));

    // Check if user exists
    const user = await User.findOne({email: decodedToken.email});
    console.log('User found? ' + user.email);

    if (!user) {
      return res
        .status(404)
        .json({message: 'The user with the given token does not exist'});
    }

    // Attach the user information to the request object for later use
    req.user = user;
    console.log('REQ USER: ' + JSON.stringify(req.user));

    // Continue to the next middleware
    next();
  } catch (error) {
    res.status(401).json({message: error.message});
  }
};
