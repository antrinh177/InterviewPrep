const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel");
const userValidation = require("../middlewares/userValidation");

// Get all users + search + sort + pagination
router.get("/", async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const filter = search ? { $text: { $search: search } } : {};

    const users = await UserModel.find(filter)
      .sort({ name: 1 }) // alphabetical order
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await UserModel.countDocuments(filter);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post("/", userValidation, async (req, res) => {
  try {
    const newUser = req.body;
    const addedUser = await UserModel.create({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role || "user",
    });

    if (!addedUser) {
      return res.status(500).send("User couldn't be added!");
    }

    res.status(201).json(addedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
router.put("/:id", userValidation, async (req, res) => {
  try {
    const userId = req.params.id;
    const newUser = req.body;

    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return res.status(404).send(`User with ID ${userId} doesn't exist`);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: { name: newUser.name, email: newUser.email, role: newUser.role },
      },
      { new: true } // return updated data
    );

    if (!updatedUser) {
      return res.status(500).send(`User with ID ${userId} couldn't be updated`);
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return res.status(404).send(`User with ID ${userId} doesn't exist`);
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(500).send(`Oops! User couldn't be deleted!`);
    }

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
