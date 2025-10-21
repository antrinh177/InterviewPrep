const express = require("express");
const {
    getAllQuestions,
    getQuestionByID,
    addNewQuestion,
    updateExistingQuestion,
    deleteQuestion
} = require("../models/questionModel");
const questionValidation = require("../middlewares/questionValidation");

const router = express.Router();

//GET all questions
router.get("/", async(req, res) => {
    try {
        const questions = await getAllQuestions();
        res.status(200).json(questions);
    } catch (e){
        res.status(500).json({error: e.message})
    }
})

//GET question by ID
router.get("/:id", async(req, res) => {
    try{
        const question = await getQuestionByID(req.params.id);
        if (!question){
            return res.status(404).json({message: "Question not found"});
        }
        res.status(200).json(question);
    } catch (e){
        res.status(500).json({error: e.message})
    }
});

//POST new question
router.post("/", questionValidation, async(req, res) => {
    try {
        const newQuestion = await addNewQuestion(req.body);
        res.status(201).json(newQuestion);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
});

//PUT existing question
router.put("/:id", questionValidation, async (req, res) => {
  try {
    const updatedQuestion = await updateExistingQuestion(req.params.id, req.body);
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