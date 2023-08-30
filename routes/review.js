const router = require("express").Router();
const { createReview, getReviews } = require("../controllers/reviews.controller");

router.post("/add", createReview);
router.get("/list", getReviews);

module.exports = router;
