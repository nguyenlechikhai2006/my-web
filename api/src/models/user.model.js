const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1. Định nghĩa Schema (Lưu ý đặt tên biến là userSchema)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);