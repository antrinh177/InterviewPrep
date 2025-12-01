const mongoose = require("mongoose");
const { encodePassword } = require("../../../utils/password-utils");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { versionKey: false }
);

UserSchema.index({ name: "text", email: "text" });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await encodePassword(this.password);
  next();
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
