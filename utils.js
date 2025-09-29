const fs = require("fs");

async function readQuestionsToFile() {
  try {
    const file = fs.readFileSync("./questions.json", "utf-8");
    return JSON.parse(file);
  } catch (error) {
    throw new Error("Couldn't read file questions.json");
  }
}

module.exports = {
  readQuestionsToFile
};