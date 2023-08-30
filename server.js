require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const verifyJWT = require("./middlewares/verifyJWT");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db.config");

// CONNECT TO MongoDB
connectDB();

// CROSS ORIGIN RESOURSE SHARING
app.use(cors());

// BUILD IN MIDDLEWARE FOR JSON
app.use(express.json());

// ROUTES
app.use("/user", require("./routes/user"));
app.use(verifyJWT);
app.use("/category", require("./routes/category"));
app.use("/review", require("./routes/review"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log("SERVER IS RUNNING ON PORT " + PORT);
  });
});
