const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryByID,
  addNewCategory,
  updateExistingCategory,
  deleteCategory,
} = require("../models/categoryModel");
const categoryValidation = require("../middlewares/categoryValidation");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await getAllCategories();
    // If no categories exist, send an empty array
    res.status(200).json(categories || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single category by ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const category = await getCategoryByID(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: `Category with ID ${id} not found` });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply validation middleware before handling request
router.post("/", categoryValidation, async (req, res) => {
  try {
    const newCategory = await addNewCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply validation middleware before handling request
router.put("/:id", categoryValidation, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const existingCategory = await getCategoryByID(id);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ message: `Category with ID ${id} not found` });
    }

    const updatedCategory = await updateExistingCategory(id, req.body);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedCategory = await deleteCategory(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ message: `Category with id ${id} not found` });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
