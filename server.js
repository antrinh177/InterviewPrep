const express = require("express");
const { readQuestionsToFile } = require("./utils.js");

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.get("/questions", async (req, res) => {
  try {
    const questions = await readQuestionsToFile();
    const {category, difficulty} = req.query;

    let filteredData = questions;

    //Get questions based on category: /questions/?category=Data Structure
    if (category) {
      const cat = category.trim().toLowerCase();
      filteredData = filteredData.filter((q) => q.Category.toLowerCase().includes(cat));
    }

    //Get questions based on difficulty: /questions/?difficulty=Hard
    //Get questions based on category & difficulty: /questions/?category=Data Structure&difficulty=Hard
    if (difficulty) {
      const diff = difficulty.trim().toLowerCase();
      filteredData = filteredData.filter((q) => q.Difficulty.toLowerCase() === diff);
    }

    if (filteredData.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    res.json(filteredData);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/questions`);
});