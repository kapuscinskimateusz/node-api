const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "User must have a firstName"],
  },
  lastName: {
    type: String,
    required: [true, "User must have a lastName"],
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
  },
  phone: String,
  birthDate: {
    type: Date,
    required: [true, "User must have a birthDate"],
  },
  role: {
    type: String,
    default: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
