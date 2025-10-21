//Model functions for questions
const {readDataFile, writeDataFile} = require("../../../utils/fileHandler")

//Get all questions
async function getAllQuestions(){
    return await readDataFile("questions.json");
}

//Get question by ID
async function getQuestionByID(id){
    const questions = await getAllQuestions();
    return questions.find(q => q.id === parseInt(id));
}

//Create new question
async function addNewQuestion(newQuestion){
    const questions = await getAllQuestions();
    questions.push(newQuestion);
    await writeDataFile("questions.json", questions)
    return newQuestion;
}

//Update existing question
async function updateExistingQuestion(id, updateData){
    const questions = await getAllQuestions();
    const i = questions.findIndex(q => q.id === parseInt(id))
    if (i === -1)
        return null
    //Use spread operator to update question
    questions[i] = {...questions[i], ...updateData};
    await writeDataFile("questions.json", questions)
    return questions[i];
}

//Delete question
async function deleteQuestion(id){
    const questions = await getAllQuestions();
    const i = questions.findIndex(q => q.id === parseInt(id))
    if (i === -1)
        return null
    //splice returns an array of deleted items
    const deletedQuestion = questions.splice(i,1);
    await writeDataFile("questions.json", questions)
    return deletedQuestion[0];
}

module.exports = {
    getAllQuestions,
    getQuestionByID,
    addNewQuestion,
    updateExistingQuestion,
    deleteQuestion
}
