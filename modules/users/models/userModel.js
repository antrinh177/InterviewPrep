const { readDataFile, writeDataFile } = require("../../../utils/fileHandler");

const usersJsonPath = "users.json";

// Get all users
const getAllUsers = () => {
  return readDataFile(usersJsonPath);
};

// Get a single user by its ID
const getUserByID = async (userId) => {
  if (!userId) {
    throw new Error(`Cannot use ${userId} to get user`);
  }
  const allUsers = await getAllUsers();
  const foundUser = allUsers.find((user) => user.id === parseInt(userId));
  return foundUser;
};

// Add a new user
const addNewUser = async (newUser) => {
  if (!newUser) {
    throw new Error(`Cannot use ${newUser} to add user`);
  }
  const allUsers = await getAllUsers();
  newUser = { id: allUsers.length + 1, ...newUser };
  allUsers.push(newUser);
  await writeDataFile(usersJsonPath, allUsers);
  return newUser;
};

// Update an existing user by its iD
const updateExistingUser = async (userId, newUser) => {
  if (!userId || !newUser) {
    throw new Error(`Cannot use ${userId} & ${newUser} to update user`);
  }
  const allUsers = await getAllUsers();
  const index = allUsers.findIndex((user) => user.id === parseInt(userId));
  if (index < 0) {
    throw new Error(`User with ${userId} does not exist`);
  }
  const updatedUser = { ...allUsers[index], ...newUser };
  allUsers[index] = updatedUser;
  await writeDataFile(usersJsonPath, allUsers);
  return updatedUser;
};

// delete a user by its ID
const deleteUser = async (userId) => {
  if (!userId) {
    throw new Error(`Cannot use ${userId} to delete user`);
  }
  const allUsers = await getAllUsers();
  const index = allUsers.findIndex((user) => user.id === parseInt(userId));
  if (index < 0) {
    throw new Error(`User with ${userId} does not exist`);
  }
  const [deletedUser] = allUsers.splice(index, 1);
  await writeDataFile(usersJsonPath, allUsers);
  return deletedUser;
};

module.exports = {
  getAllUsers,
  getUserByID,
  addNewUser,
  updateExistingUser,
  deleteUser,
};
