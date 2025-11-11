const mongoose = require('mongoose');
//Model functions for questions
const {readDataFile, writeDataFile} = require("../../../utils/fileHandler");
const { query } = require('express-validator');

//Create schema for question
const questionSchema = new mongoose.Schema({
    Category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    Difficulty: {
        type: String,
        required: [true, 'Difficulty is required'],
        enum: ['Easy', 'Medium', 'Hard'],
        trim: true
    },
    Question: {
        type: String,
        required: [true, 'Question is required'],
        trim: true
    }
})

const Question = mongoose.model('Question', questionSchema);

//Get all questions with Mongoose
const getAllQuestions = async(query) => {
    const filter = {};
    if (query.category) {
        filter.Category = query.category;
    }
    if (query.difficulty) {
        filter.Difficulty = query.difficulty;
    }
    if (query.search) {
        filter.Question = { $regex: query.search, $options: 'i' };
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const questions = await Question
    .find(filter)
    .sort(query.sort)
    .skip(skip)
    .limit(parseInt(limit));

    const totalQuestions = await Question.countDocuments(filter);

    return {
        questions,
        pagination: {
            current_page: parseInt(page),
            max_questions_per_page: parseInt(limit),
            total_questions: totalQuestions,
            total_pages: Math.ceil(totalQuestions / limit)
        }
    }
}

//Get question by ID with Mongoose
const getQuestionByID = async(id) => {
    if (id){
        return await Question.findById(id);
    } else {
        throw new Error(`Invalid id: ${id}`);
    }
}

//Create new question with Mongoose
const addNewQuestion = async(newQuestion) => {
    if (newQuestion) {
        const question = new Question(newQuestion);
        return await question.save();
    } else {
        throw new Error(`Invalid question data: ${newQuestion}`);
    }
}

//Update existing question with Mongoose
const updateExistingQuestion = async(id, updateData) => {
    if (id && updateData) {
        return await Question.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })
    } else {
        throw new Error(`Invalid id: ${id}/update data: ${updateData}`);
        
    }
}

//Delete question with Mongoose
const deleteQuestion = async(id) => {
    if(id){
        return await Question.findByIdAndDelete(id);
    } else {
        throw new Error(`Invalid id: ${id}`)
    }
}

module.exports = {
    getAllQuestions,
    getQuestionByID,
    addNewQuestion,
    updateExistingQuestion,
    deleteQuestion
}
