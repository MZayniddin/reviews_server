const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  res.send("OK");
};

exports.getReviews = async (req, res) => {
  res.json(await Review.find({}));
};
