const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  main: { type: String }
});

CategorySchema.index({ name: "text" });

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
