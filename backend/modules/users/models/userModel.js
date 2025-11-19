const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.index({ name: "text", email: "text" });

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
