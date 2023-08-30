const router = require("express").Router();
const categoryCtr = require("../controllers/category.controller");

router.get("/", categoryCtr.getCategoryList);

module.exports = router;
