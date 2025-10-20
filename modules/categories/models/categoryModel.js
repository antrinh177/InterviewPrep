const { readDataFile, writeDataFile } = require("../../../utils/fileHandler");

const categoriesJsonPath = "categories.json";

// Get all categories from the categories.json file
const getAllCategories = () => {
  return readDataFile(categoriesJsonPath);
};

// Get a single category by its ID
const getCategoryByID = async (categoryId) => {
  if (!categoryId) {
    throw new Error(`Cannot use ${categoryId} to get category`);
  }
  const allCategories = await getAllCategories();
  const foundCategory = allCategories.find(
    (category) => category.id === parseInt(categoryId)
  );
  return foundCategory;
};

// Add a new category to the categories list
const addNewCategory = async (newCategory) => {
  if (!newCategory) {
    throw new Error(`Cannot use ${newCategory} to add category`);
  }
  const allCategories = await getAllCategories();
  newCategory = { id: allCategories.length + 1, ...newCategory };
  allCategories.push(newCategory);
  await writeDataFile(categoriesJsonPath, allCategories);
  return newCategory;
};

const updateExistingCategory = async (categoryId, newCategory) => {
  if (!categoryId || !newCategory) {
    throw new Error(
      `Cannot use ${categoryId} & ${newCategory} to update category`
    );
  }

  const allCategories = await getAllCategories();
  const index = allCategories.findIndex(
    (category) => category.id === parseInt(categoryId)
  );

  if (index < 0) {
    throw new Error(`Category with ${categoryId} does not exist`);
  }
  const updatedCategory = { ...allCategories[index], ...newCategory };
  allCategories[index] = updatedCategory;
  await writeDataFile(categoriesJsonPath, allCategories);
  return updatedCategory;
};

// Delete a category by its ID
const deleteCategory = async (categoryId) => {
  if (!categoryId) {
    throw new Error(`Cannot use ${categoryId} to delete category`);
  }
  const allCategories = await getAllCategories();
  const index = allCategories.findIndex(
    (category) => category.id === parseInt(categoryId)
  );
  if (index < 0) {
    throw new Error(`Category with ${categoryId} does not exist`);
  }
  const [deletedCategory] = allCategories.splice(index, 1);
  await writeDataFile(categoriesJsonPath, allCategories);
  return deletedCategory;
};

module.exports = {
  getAllCategories,
  getCategoryByID,
  addNewCategory,
  updateExistingCategory,
  deleteCategory,
};
