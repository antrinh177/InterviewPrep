const express = require("express");
const router = express.Router();
const CategoryModel = require("../models/categoryModel");
const categoryValidation = require("../middlewares/categoryValidation");

// Get all categories + search + sort + pagination
router.get("/", async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const filter = search ? { $text: { $search: search } } : {};

    const categories = await CategoryModel.find(filter)
      .sort({ name: 1 }) // alphabetical order
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await CategoryModel.countDocuments(filter);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single category by ID
router.get("/:id", async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category)
      return res
        .status(404)
        .json({ message: `Category with ID ${categoryId} not found` });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new category
router.post("/", categoryValidation, async (req, res) => {
  try {
    const newCategory = req.body;
    const addedCategory = await CategoryModel.create({
      name: newCategory.name,
    });

    if (!addedCategory) {
      return res.status(500).send("Category couldn't be added!");
    }

    res.status(201).json(addedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update a category by ID
router.put("/:id", categoryValidation, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const newCategory = req.body;

    const foundCategory = await CategoryModel.findById(categoryId);
    if (!foundCategory) {
      return res
        .status(404)
        .send(`Category with ID ${categoryId} doesn't exist`);
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { $set: { name: newCategory.name } },
      { new: true } // return updated data
    );

    if (!updatedCategory) {
      return res
        .status(500)
        .send(`Category with ID ${categoryId} couldn't be updated`);
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const foundCategory = await CategoryModel.findById(categoryId);
    if (!foundCategory) {
      return res
        .status(404)
        .send(`Category with ID ${categoryId} doesn't exist`);
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(500).send(`Oops! Category couldn't be deleted!`);
    }

    res.status(200).json({
      message: "Category deleted successfully",
      deletedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
