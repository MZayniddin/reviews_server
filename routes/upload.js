const router = require("express").Router();
const { uploadImage } = require("../controllers/upload.controller");

router.post("/", uploadImage);

module.exports = router;
