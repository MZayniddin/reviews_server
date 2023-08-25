exports.handleSignUp = async (req, res) => {
  const { displayName, email, password, confirmPassword } = req.body;
  if (!email || password)
    return res
      .status(400)
      .json({ message: "Email and password are required!" });

  try {
  } catch (error) {}
};

exports.handleSignIn = async (req, res) => {
  res.send("OK");
};
