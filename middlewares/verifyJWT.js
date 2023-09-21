const jwt = require("jsonwebtoken");
const axios = require("axios");

const verifyGoogleToken = (token) =>
  axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
  );

const verifyFacebookToken = (token) =>
  axios.get(
    `https://graph.facebook.com/v12.0/me?fields=email&access_token=${token}`
  );

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  if (token.startsWith("ya29.")) {
    // Google Access Token
    try {
      const { data } = await verifyGoogleToken(token);
      req.user = data.email;
      next();
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  } else if (token.startsWith("ey") && token.split(".").length === 3) {
    // JWT Token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.UserInfo.email;
      req.roles = decoded.UserInfo.roles;
      next();
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  } else if (token.startsWith("EAA")) {
    // Facebook Token
    try {
      const { data } = await verifyFacebookToken(token);
      req.user = data.email;
      next();
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  } else {
    console.error("Unknown token type");
    return req.status(403).json({ message: "Unknown token type" });
  }
};

module.exports = verifyToken;
