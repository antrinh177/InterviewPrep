const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserByID,
  addNewUser,
  updateExistingUser,
  deleteUser,
} = require("../models/userModel");
const userValidation = require("../middlewares/userValidation");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    // If no users exist, send an empty array
    res.status(200).json(users || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user by its ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await getUserByID(id);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply validation middleware before handling request
router.post("/", userValidation, async (req, res) => {
  try {
    const newUser = await addNewUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply validation middleware before handling request
router.put("/:id", userValidation, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const existingUser = await getUserByID(id);
    if (!existingUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    const updatedUser = await updateExistingUser(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by its ID
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
