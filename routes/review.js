const router = require("express").Router();
const {
  createReview,
  getReviews,
  updateReview,
  likeReview,
  commentReview,
} = require("../controllers/reviews.controller");

router.post("/add", createReview);
router.get("/list", getReviews);
router.put("/update/:reviewId", updateReview);
router.patch("/like/:reviewId", likeReview);
router.patch("/comment/:reviewId", commentReview)

module.exports = router;
