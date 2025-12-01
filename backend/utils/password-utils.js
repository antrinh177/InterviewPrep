const bcrypt = require("bcrypt");

const encodePassword = (raw) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(raw, salt);
  } catch (error) {
    console.error("Password encoding failed:", error);
    throw error;
  }
};

const matchPassword = (raw, encoded) => {
  try {
    return bcrypt.compareSync(raw, encoded);
  } catch (error) {
    console.error("Password comparison failed:", error);
    return false;
  }
};

module.exports = { encodePassword, matchPassword };
