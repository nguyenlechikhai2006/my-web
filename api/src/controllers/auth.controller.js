const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// 1. CHỨC NĂNG ĐĂNG KÝ (Register)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ ok: false, message: "Email này đã được nhận quà rồi! 🎅" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: "user"
    });

    // Trả về kết quả (ẩn passwordHash để bảo mật)
    res.status(201).json({ 
      ok: true, 
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      } 
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// 2. CHỨC NĂNG ĐĂNG NHẬP (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng trong MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ ok: false, message: "Email hoặc mật khẩu không đúng 🎄" });
    }

    // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ ok: false, message: "Email hoặc mật khẩu không đúng 🎄" });
    }

    // Đăng nhập thành công
    res.status(200).json({
      ok: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Lỗi hệ thống Noel, vui lòng thử lại sau" });
  }
};