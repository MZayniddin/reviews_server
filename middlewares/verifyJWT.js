const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token
      req.user = decoded.UserInfo.id;
      req.roles = decoded.UserInfo.roles;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyJWT;
