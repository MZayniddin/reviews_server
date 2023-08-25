const router = require("express").Router();
const userCtr = require("../controllers/user.controller");

router.post("/signup", userCtr.handleSignUp);
router.post("/signin", userCtr.handleSignIn);

module.exports = router;
