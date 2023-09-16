const router = require("express").Router();
const verifyJWT = require("../middlewares/verifyJWT");

const {
  createReview,
  getReviews,
  updateReview,
  likeReview,
  commentReview,
  getUserReview,
  getOneReview,
} = require("../controllers/reviews.controller");

router.get("/list", getReviews);
router.get("/profile", verifyJWT, getUserReview);
router.get("/:reviewId", getOneReview);
router.post("/add", verifyJWT, createReview);
router.put("/update/:reviewId", verifyJWT, updateReview);
router.patch("/like/:reviewId", verifyJWT, likeReview);
router.patch("/comment/:reviewId", verifyJWT, commentReview);

module.exports = router;
