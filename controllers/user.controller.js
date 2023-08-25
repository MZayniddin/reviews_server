const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const tokenGenerator = require("../helpers/tokenGenerator.js");

exports.handleSignUp = async (req, res) => {
  const { displayName, email, password, confirmPassword } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required!" });

  try {
    // CHECK DUPLICATE
    const existingUser = await User.findOne({ email }).exec();

    if (existingUser)
      return res.status(409).json({ message: "Email already in use" });

    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ message: "Confirm Password was Incorrect" });

    // ENCRYPTION PASSWORD
    const hashPwd = await bcrypt.hash(password, 10);

    // CREATING NEW USER
    const newUser = await User.create({
      email,
      password: hashPwd,
      displayName,
    });

    // CREATE TOKEN
    const token = tokenGenerator(newUser);

    res.json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleSignIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required!" });

  try {
    // CHECK THE USER EXISTS
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser)
      return res
        .status(404)
        .json({ message: "User not found with this email" });

    // CHECK THE PASSWORD
    const matchPwd = await bcrypt.compare(password, foundUser.password);

    if (!matchPwd) return res.status(400).json({ message: "Invalid password" });

    // TOKEN GENERATING
    const token = tokenGenerator(foundUser);

    res.json({ user: foundUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
