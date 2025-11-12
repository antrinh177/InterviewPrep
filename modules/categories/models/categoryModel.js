const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
});

CategorySchema.index({ name: "text" });

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
