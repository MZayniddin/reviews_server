const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  tags: [String],
  description: { type: String, required: true },
  image: String,
  creator: { type: String, required: true },
  grade: { type: Number, required: true },
  likes: { type: [String], default: [] },
  comments: [
    {   
      type: {
        rate: Number,
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        date: { type: Date, default: new Date() },
        text: String,
      },
      default: [],
    },
  ],
  created_At: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
