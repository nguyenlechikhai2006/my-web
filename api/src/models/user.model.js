const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1. Định nghĩa Schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Vui lòng nhập tên"], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Vui lòng nhập email"], 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  passwordHash: { 
    type: String, 
    required: [true, "Vui lòng nhập mật khẩu"] 
  },
  role: { 
    type: String, 
    enum: ["user", "admin"], // Chỉ cho phép 2 quyền này
    default: "user" 
  }
}, { 
  timestamps: true,
  versionKey: false // Bỏ cái __v: 0 nếu bạn muốn nhìn dữ liệu sạch hơn
});

// 2. MIDDLEWARE: Tự động mã hóa mật khẩu trước khi lưu (Giúp Logic Đăng ký an toàn)
userSchema.pre("save", async function(next) {
  // Chỉ mã hóa nếu mật khẩu bị thay đổi (hoặc tạo mới)
  if (!this.isModified("passwordHash")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 3. PHƯƠNG THỨC KIỂM TRA MẬT KHẨU (Dùng khi Đăng nhập)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);