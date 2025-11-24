const mongoose = require("mongoose");
require("dotenv").config();

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  main: { type: String }
});

const Category = mongoose.model("Category", CategorySchema);

const categoryMapping = {
  // Core Computer Science
  "General Programming": "Core Computer Science",
  "Data Structures": "Core Computer Science",
  "Algorithms": "Core Computer Science",
  "General Program": "Core Computer Science",
  
  // Software Engineering
  "Languages and Frameworks": "Software Engineering",
  "Web Development": "Software Engineering",
  "Front-end": "Software Engineering",
  "Back-end": "Software Engineering",
  "Full-stack": "Software Engineering",
  "Software Testing": "Software Engineering",
  "Version Control": "Software Engineering",
  
  // System & Infrastructure
  "System Design": "System & Infrastructure",
  "Distributed Systems": "System & Infrastructure",
  "Networking": "System & Infrastructure",
  "Low-level Systems": "System & Infrastructure",
  "DevOps": "System & Infrastructure",
  "Security": "System & Infrastructure",
  
  // Data & Databases
  "Database and SQL": "Data & Databases",
  "Database Systems": "Data & Databases",
  "Data Engineering": "Data & Databases",
  
  // Artificial Intelligence & ML
  "Machine Learning": "Artificial Intelligence & ML",
  "Artificial Intelligence": "Artificial Intelligence & ML"
};

async function updateCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const [categoryName, mainCat] of Object.entries(categoryMapping)) {
      const result = await Category.updateMany(
        { name: categoryName },
        { $set: { main: mainCat } }
      );
      console.log(`Updated ${categoryName}: ${result.modifiedCount} document(s)`);
    }

    console.log("\nAll categories updated successfully!");
    
    // Display updated categories grouped by main
    const allCategories = await Category.find().sort({ main: 1, name: 1 });
    console.log("\nCategories grouped by main:");
    
    let currentMainCat = "";
    allCategories.forEach(cat => {
      if (cat.main !== currentMainCat) {
        currentMainCat = cat.main;
        console.log(`\n${currentMainCat || "Uncategorized"}:`);
      }
      console.log(`  - ${cat.name}`);
    });

  } catch (error) {
    console.error("Error updating categories:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nDisconnected from MongoDB");
  }
}

updateCategories();