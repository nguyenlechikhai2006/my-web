const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1. Định nghĩa Schema (Lưu ý đặt tên biến là userSchema)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "user" }
}, { timestamps: true });

// 2. Gán phương thức comparePassword vào userSchema
// Lỗi nãy giờ là do bạn viết UserSchema (chữ U hoa) trong khi chưa khai báo nó
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model("User", userSchema);
module.exports = { User };