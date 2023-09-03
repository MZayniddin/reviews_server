const jwt = require("jsonwebtoken");
const axios = require("axios");

async function verifyGoogleToken(token, req) {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
    );
    return data;
  } catch (error) {
    console.error("Google token verification failed:", error.message);
  }
}

async function verifyFacebookToken(token, req) {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v12.0/me?access_token=${token}`
    );
    return data;
  } catch (error) {
    console.error("Facebook token verification failed:", error.message);
  }
}

function verifyJWTToken(token, req) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("JWT token verification failed:", error.message);
  }
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  let userId;

  if (token.startsWith("ya29.")) {
    // Google Access Token
    const data = await verifyGoogleToken(token);
    req.user = data.id;
    next();
  } else if (token.startsWith("ey") && token.split(".").length === 3) {
    // JWT Token
    const { UserInfo } = verifyJWTToken(token);
    req.user = UserInfo.id;
    req.roles = UserInfo.roles;
    next();
  } else if (token.startsWith("EAA")) {
    // Facebook Token
    const data = await verifyFacebookToken(token);
    req.user = data.id;
    next();
  } else {
    console.error("Unknown token type");
    return req.status(400).json({ message: "Unknown token type" });
  }
};

module.exports = verifyToken;
