const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  tags: [String],
  description: { type: String, required: true },
  image: String,
  grade: { type: Number, required: true },
  likes: { type: [String], default: [] },
  comments: [
    {
      type: { rate: Number, user: mongoose.Types.ObjectId, ref: "User" },
      default: [],
    },
  ],
});

module.exports = mongoose.model("Review", ReviewSchema);
