const mongoose = require("mongoose");
const Review = require("../models/Review");

exports.getReviews = async (req, res) => {
  res.json(await Review.find().sort({ _id: -1 }));
};

exports.createReview = async (req, res) => {
  const review = req.body;

  const newReview = new Review({
    ...review,
    creator: req.user,
    createdAt: new Date().toISOString(),
  });

  try {
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  const { reviewId: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const updatedReview = await Review.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  res.json(updatedReview);
};

exports.deleteReview = async (req, res) => {
  const { reviewId: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  await Review.findByIdAndRemove(_id);

  res.json({ message: "Post deleted successfully" });
};

exports.commentReview = async (req, res) => {
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    return res.status(404).send("No post with that id");

  const { rate, text } = req.body;

  if (!rate || !text)
    return res.status(400).json({ message: "Rate and text required!" });

  const review = await Review.findOne({ _id: reviewId }).exec();
  const newComment = {
    rate,
    text,
    date: new Date().toISOString(),
    user: req.user,
  };
  review.comments.push(newComment);

  try {
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeReview = async (req, res) => {
  const { reviewId } = req.params;

  if (!req.user) return res.status(400).json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    return res.status(404).send("No post with that id");

  const review = await Review.findById(reviewId);

  const index = review.likes.findIndex((id) => id === String(req.user));

  if (index === -1) {
    review.likes.push(req.user);
  } else {
    review.likes = review.likes.filter((id) => id !== String(req.user));
  }

  const updatedReview = await Review.findByIdAndUpdate(reviewId, review, {
    new: true,
  });

  res.json(updatedReview);
};
