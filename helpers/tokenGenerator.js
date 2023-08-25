const jwt = require("jsonwebtoken");

const tokenGenerator = (user) => {
  const roles = Object.values(user.roles);
  return jwt.sign(
    { UserInfo: { id: user._id, email: user.email, roles } },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_TIME }
  );
};

module.exports = tokenGenerator;
