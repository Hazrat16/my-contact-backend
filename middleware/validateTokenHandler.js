const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  console.log("authHeader",authHeader)

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "User is not authorized" });
      }
      console.log("Decoded token:", decoded);
      if (!decoded || !decoded.user) {
        console.error("Invalid token format");
        return res.status(401).json({ message: "Invalid token format" });
      }
      req.user = decoded.user;
      console.log("User data attached to request:", req.user);
      next();
    });
  } else {
    res.status(401).json({ message: "Token is missing" });
  }
});

module.exports = validateToken;
