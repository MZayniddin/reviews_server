const mongoose = require("mongoose");
const Review = require("../models/Review");

exports.getReviews = async (req, res) => {
  const result = await Review.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "email",
        as: "creator",
      },
    },
    {
      $unwind: {
        path: "$creator", // given name
        preserveNullAndEmptyArrays: true,
      },
    },
  ]).sort({ _id: -1 });

  res.json(result);
};

exports.getOneReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "email",
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator", // given name
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: { _id: new mongoose.Types.ObjectId(reviewId) },
      },
    ]);

    res.json(review[0]);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
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
  const updatedReview = await Review.findByIdAndUpdate(
    _id,
    { ...req.body, creator: req.user },
    {
      new: true,
    }
  );

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

  const index = review.comments.findIndex(
    (comment) => comment.user === String(req.user)
  );

  if (index === -1) {
    review.comments.push(newComment);
  } else {
    review.comments[index] = newComment;
  }

  try {
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserReview = async (req, res) => {
  try {
    const { category, sort } = req.query;

    let result = await Review.find({ creator: req.user }).sort({ _id: +sort });

    if (category) {
      result = result.filter((review) => review.category.equals(category));
    }

    res.json(result);
  } catch (error) {
    console.log(error);
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

  const result = await Review.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "email",
        as: "creator",
      },
    },
    {
      $unwind: {
        path: "$creator", // given name
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: { _id: updatedReview._id },
    },
  ]);

  res.json(result[0]);
};
