const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

exports.authenticateUser = async (req, res, next) => {
  try {
    // Check if authorization header credentials were sent with request.
    if (!req.headers.authorization) return res.status(401).json({ message: "Authorization header required" });

    // Check if the authorization type is Bearer.
    if (!req.headers.authorization.startsWith("Bearer "))
      return res.status(401).json({ message: "Authorization format is: Bearer <token>" });

    // Get the token from the authorization header by removing "Bearer " from the string.
    let token = req.headers.authorization.replace("Bearer ", "");

    // Returns the payload if the signature is valid.
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) return res.status(500).json({ error });

      // Check for invalid token.
      if (!decodedToken) return res.status(401).json({ message: "Invalid authorization token. Please login." });

      // The decodedToken values are the user's details.
      req.user = decodedToken;

      // Go to next available middleware.
      next();
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Server error. Possible error with token." });
  }
};
