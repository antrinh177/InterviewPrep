const fs = require("fs");
const path = require("path");

// Define paths relative to the script location
const questionsFilePath = path.join(__dirname, "../data/questions1.json");
const categoriesFilePath = path.join(__dirname, "../data/cat1.json");

// Read the JSON file
let rawInputData;
try {
  const fileContent = fs.readFileSync(questionsFilePath, "utf-8");
  rawInputData = JSON.parse(fileContent);
  console.log(
    `Successfully read questions from ${path.basename(questionsFilePath)}`
  );
} catch (error) {
  console.error(
    `Error reading or parsing ${path.basename(questionsFilePath)}: ${
      error.message
    }`
  );
  process.exit(1);
}

// Extract and format categories
let questionsArray = [];

// Logic to check for nested arrays and get the actual questions array
if (
  Array.isArray(rawInputData) &&
  rawInputData.length === 1 &&
  Array.isArray(rawInputData[0])
) {
  // In case of a nested structure (an array with a single array element)
  questionsArray = rawInputData[0];
  console.log(
    `Nested array structure detected. Processing ${questionsArray.length} questions.`
  );
} else if (Array.isArray(rawInputData)) {
  // In case of a normal structure (contains question objects directly)
  questionsArray = rawInputData;
  console.log(
    `Standard array structure detected. Processing ${questionsArray.length} questions.`
  );
} else {
  // Error handling if the data is not in a valid array format
  console.error("Error: Input data is not in a valid array format.");
  process.exit(1);
}

if (questionsArray.length === 0) {
  console.warn(
    "Warning: The question data to be processed is empty. categories.json will also be empty."
  );
}

// Extract only category names and remove duplicates using a Set
const uniqueCategoryNames = new Set(
  questionsArray
    .map((q) => q.Category || q.category)
    .filter((name) => name && name.trim() !== "") // Filter for category names that exist and are not empty strings
);

// Format the category names alphabetically
const sortedCategoryNames = Array.from(uniqueCategoryNames).sort();

// Format the data into objects with ID and Name
const finalCategories = sortedCategoryNames.map((name, index) => ({
  id: index + 1, // Make the ID a sequential number starting from 1
  name: name,
}));

// Write to JSON file
try {
  // Format with an indent of 2 using JSON.stringify
  const jsonOutput = JSON.stringify(finalCategories, null, 2);

  fs.writeFileSync(categoriesFilePath, jsonOutput, "utf-8");

  console.log(
    `Success: The category list has been saved to '${path.basename(
      categoriesFilePath
    )}'. A total of ${finalCategories.length} categories were output.`
  );
} catch (error) {
  console.error(`A file writing error has occurred: ${error.message}`);
}
