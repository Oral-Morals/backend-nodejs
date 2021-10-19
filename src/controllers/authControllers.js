const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { TokenModel } = require("../models/tokenModel");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../services/emailService");
moment().format();

exports.authorizeAge = async (req, res, next) => {
  try {
    // Check if the user's age is under 18 years old

    const userDOB = moment(req.body.dateOfBirth);
    const earliestDOB = moment().subtract(18, "years");

    // If the user's DOB is after the earliest DOB to be 18 years old today,
    // the user is younger than 18 years old.
    if (userDOB.isAfter(earliestDOB)) {
      return res.status(403).json({ success: false, message: "User must be 18 or older to use app." });
    }

    // If the user's DOB is valid, the response is 200 and DOB is sent back to be used in the registration flow.
    if (!userDOB.isAfter(earliestDOB)) return res.status(200).json({ success: true, data: { dateOfBirth: userDOB } });

    // Go to next available middleware.
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.authorizeUser = async (req, res, next) => {
  try {
    // Check if authorization header credentials were sent with request.
    if (!req.headers.authorization) return res.status(401).json({ message: "Authorization header required" });

    // Check if the authorization type is Bearer.
    if (!req.headers.authorization.startsWith("Bearer "))
      return res.status(401).json({ message: "Authorization format is: Bearer <token>" });

    // Get the token from the authorization header by removing "Bearer " from the string.
    let token = req.headers.authorization.replace("Bearer ", "");

    // Returns the payload if the signature is valid.
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
      if (error) return res.status(500).json({ error });

      // Check for invalid token.
      if (!decodedToken) return res.status(401).json({ message: "Invalid authorization token. Please login." });

      // The decodedToken values are the user's details.
      req.user = decodedToken;

      // Go to next available middleware.
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Possible error with token." });
  }
};

exports.signup = async (req, res) => {
  try {
    // Search for existing user email
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(401).json({
        message: "The email address you have entered is already associated with another account",
      });

    // If no user exists, generate salt and hash password
    const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.SALT));

    // Create new user
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      password: hashedPassword,
    });

    //Create Token for new user
    let token = await TokenModel.create({
      userID: newUser._id,
      token: uuidv4(),
      expiresIn: moment().add(1, "hours"),
      tokenType: "email-verification",
    });

    // Properties to send through the email
    const to = newUser.email;
    const subject = "Activate your Oral Morals Account Now";
    const html = `<p>
        You're just one click away from getting started with Oral Morals. All you need to do is verify your email
        address to activate your Oral Morals account. Click <a href="http://localhost:${process.env.PORT}/api/v1/auth/verify/${token.token}">here</a>
      </p>`;

    await sendMail({ to, subject, html });

    return res.status(201).json({ message: "New User Created", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.emailVerification = async (req, res) => {
  try {
    // Search for the token to verify
    let token = await TokenModel.findOne({ token: req.params.token });

    // Send this message if the found token is expired
    if (token.expired)
      return res
        .status(401)
        .json({ message: "Token may be expired. If you can't login, please request another token." });

    // If the time for the token's validity is expired, save token status as expired.
    if (moment(token.expiresIn) < moment()) {
      token.expired = true;
      await token.save();

      // Send this message if token is expired
      return res
        .status(401)
        .json({ message: "Token may be expired. If you can't login, please request another token." });
    }

    // Search for the user by it's token
    let user = await User.findOne({ _id: token.userID });

    // Send this message if the user could not be found
    if (!user) return res.status(400).json({ message: "Could not find a user with this token." });

    // Send this message if the user found has already been verified
    if (user.isVerified) return res.status(400).json({ message: "This account is already verified. Please log in." });

    // If the user found has been verified, change the status to true
    user.isVerified = true;
    await user.save();

    //Update these properties in the token model
    await TokenModel.updateMany({ userID: user._id }, { expired: true });

    return res.status(200).json({ message: "Your account has been verified! Please log in." });
  } catch (err) {
    console.log(err);
    if (err) return res.status(500).json({ success: false, message: err.message });
  }
};

exports.resendEmailVerToken = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).json({ message: "We were unable to find a user with that email." });
    if (user.isVerified) return res.status(403).json({ message: "This account is already verified. Please log in." });

    let newToken = await TokenModel.create({
      userID: user._id,
      token: uuidv4(),
      expiresIn: moment().add(1, "hours"),
      tokenType: "email-verification",
    });

    const to = user.email;
    const subject = "Activate your Oral Moral's Account Now";
    const html = `<p>You're just one click away from getting started with Oral Morals. All you need to do is verify your email address to activate your Oral Morals account. Click <a href="http://localhost:${process.env.PORT}/api/v1/auth/verify/${newToken.token}">here</a></p>`;

    await sendMail({ to, subject, html });
    res.status(200).json({ message: `A verification email has been sent to ${user.email}.` });
  } catch (err) {
    console.log(err);
    if (err) return res.status(500).json({ message: "Something went wrong. Please try again later" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search for existing user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        message: `The email ${req.body.email} is not associated with any account. Double-check your email and try again.`,
      });

    // If existing user is found, compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect Email or Password" });

    // acquire the verified status
    const verifiedStatus = user.isVerified;

    // check if status is true or false
    if (verifiedStatus === false) {
      // if false, don't allow user to log in
      return res.status(400).json({ message: "Please check your email and verify your account." });
    } else {
      // if true, allow user to log in
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).json({ message: `${user.email} logged in successfully!`, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    // Search for existing user
    let user = await User.findOne({ email: req.body.email });
    // Search for the token to verify
    let token = await TokenModel.findOne({ userID: user._id, token: req.body.otp });

    // If the token is expired send this message
    if (token.expired === true) {
      return res.status(401).json({ message: "The token is expired, please request a new one." });
    }
    // If the token is incorrect, send this message
    if (!token) {
      return res.status(409).json({ message: "Please request a new one-time-password" });
    }
    // Return the token object
    res.status(200).json(token);
  } catch (err) {
    console.log(err);
    if (err) return res.status(500).json({ message: "Something went wrong. Please try again later" });
  }
};

exports.passwordResetRequest = async (req, res) => {
  try {
    // Search for existing user by email
    let user = await User.findOne({ email: req.body.email });

    // If user is not found send this message
    if (!user) return res.status(400).json({ message: "We were unable to find a user with that email." });

    // Create unique 6 digit code
    const sixDigitCode = Math.floor(100000 + Math.random() * 900000);

    let newToken = await TokenModel.create({
      userID: user._id,
      token: sixDigitCode,
      expiresIn: moment().add(5, "minutes"),
      tokenType: "OTP",
    });

    const to = user.email;
    const subject = "Forgot your password?";
    const html = `<p>Here is your one time password! Please use this code to verify: ${sixDigitCode}</p>`;

    await sendMail({ to, subject, html });

    res.status(200).json({ message: `A verification email has been sent to ${user.email} with further instructions.` });
  } catch (err) {
    console.log(err);
    if (err) return res.status(500).json({ message: "Something went wrong. Please try again later" });
  }
};

exports.passwordReset = async (req, res) => {
  try {
    let token = await TokenModel.findOne({ token: req.body.token });

    if (!token)
      return res
        .status(401)
        .json({ message: "Token may be expired. If you can't login, please request another token." });

    if (token.expired)
      return res
        .status(401)
        .json({ message: "Token may be expired. If you can't login, please request another token." });

    if (moment(token.expiresIn) < moment()) {
      token.expired = true;
      await token.save();

      return res
        .status(401)
        .json({ message: "Token may be expired. If you can't login, please request another token." });
    }

    let user = await User.findOne({ _id: token.userID });

    if (!user) return res.status(500).json({ message: "Something went wrong. Please try again later" });

    token.expired = true;
    await token.save();

    const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.SALT));
    user.password = hashedPassword;

    await user.save();

    await TokenModel.updateMany({ userID: user._id }, { expired: true });

    const to = user.email;
    const subject = "Password updated";
    const html = `<p>Your password has been updated. Please login.</p>`;

    // sendEmail(to, subject, html);

    res.status(200).json({ message: "Password updated. Please login." });
  } catch (err) {
    console.log(err);
    if (err) return res.status(500).json({ message: "Something went wrong. Please try again later" });
  }
};
