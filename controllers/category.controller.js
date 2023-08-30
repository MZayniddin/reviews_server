const Category = require("../models/Category");

exports.getCategoryList = async (req, res) => {
  res.json(await Category.find({}));
};
