require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db.config");

// CONNECT TO MongoDB
connectDB();




mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log("SERVER IS RUNNING ON PORT " + PORT);
  });
});
