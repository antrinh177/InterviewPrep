const express = require("express");
const {
  getAllQuestions,
  getQuestionByID,
  addNewQuestion,
  updateExistingQuestion,
  deleteQuestion,
} = require("../models/questionModel");
const questionValidation = require("../middlewares/questionValidation");

const router = express.Router();

// GET /questions/search?name=xxx&difficulty=Easy,Medium
router.get("/search", async (req, res) => {
  try {
    const { categoryname, difficulty } = req.query;
    // build query object
    const query = {};
    if (categoryname) query.Category = categoryname;

    let diffArray = [];
    if (difficulty) {
      diffArray = difficulty.split(",").map((d) => d.trim().toLowerCase());
      // Prepare query to match lowercase difficulty values in MongoDB
      query.Difficulty = { $in: diffArray };
    }

    // Fetch all questions matching the query
    const allQuestionsObj = await getAllQuestions(query);
    let questionsArray = allQuestionsObj.questions || [];

    // Final filter in case MongoDB does not store difficulty in lowercase
    if (diffArray.length > 0) {
      questionsArray = questionsArray.filter((q) =>
        diffArray.includes(q.Difficulty.toLowerCase())
      );
    }

    const message =
      questionsArray.length === 0
        ? "No questions matches the criteria"
        : `${questionsArray.length} question(s) found`;

    res.status(200).json({
      questions: questionsArray,
      message,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//GET all questions
router.get("/", async (req, res) => {
  try {
    const questions = await getAllQuestions(req.query);
    res.status(200).json(questions);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//GET question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await getQuestionByID(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//POST new question
router.post("/", questionValidation, async (req, res) => {
  try {
    const newQuestion = await addNewQuestion(req.body);
    res.status(201).json(newQuestion);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//PUT existing question
router.put("/:id", questionValidation, async (req, res) => {
  try {
    const updatedQuestion = await updateExistingQuestion(
      req.params.id,
      req.body
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//DELETE question
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuestion = await deleteQuestion(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
