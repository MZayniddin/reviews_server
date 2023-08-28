const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  displayName: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  picture: String,
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Admin: Number,
  },
});

module.exports = mongoose.model("User", UserSchema);
