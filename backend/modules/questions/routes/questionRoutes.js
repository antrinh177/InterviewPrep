const express = require("express");
const {
  getAllQuestions,
  getQuestionByID,
  addNewQuestion,
  updateExistingQuestion,
  deleteQuestion,
} = require("../models/questionModel");
const CategoryModel = require("../../categories/models/categoryModel");
const questionValidation = require("../middlewares/questionValidation");

const router = express.Router();

// GET /questions/search?category=xxx&difficulty=Easy,Medium
router.get("/search", async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    console.log('Search params:', { category, difficulty });
    
    // build query object
    const query = {};
    if (category) query.category = category;

    let diffArray = [];
    if (difficulty) {
      diffArray = difficulty.split(",").map((d) => d.trim());
      // Capitalize first letter to match database format (Easy, Medium, Hard)
      diffArray = diffArray.map(d => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase());
      query.difficulty = { $in: diffArray };
    }
    
    console.log('MongoDB query:', query);

    // Fetch all questions matching the query
    const allQuestionsObj = await getAllQuestions(query);
    let questionsArray = allQuestionsObj.questions || [];
    
    console.log('Questions found:', questionsArray.length);

    // // Populate 'main' field from categories
    // const categories = await CategoryModel.find();
    // const categoryMap = {};
    // categories.forEach(cat => {
    //   categoryMap[cat.name] = cat.main;
    // });

    // // Add 'main' field to each question (in case getAllQuestions didn't add it)
    // questionsArray = questionsArray.map(q => ({
    //   ...q,
    //   main: q.main || categoryMap[q.Category] || 'Uncategorized'
    // }));

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
