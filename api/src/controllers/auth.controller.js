const User = require("../models/user.model");



// 1. CHỨC NĂNG ĐĂNG KÝ (Register)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ ok: false, message: "Email này đã được nhận quà rồi! 🎅" });
    }

    // TỐI ƯU: Không cần bcrypt ở đây nữa vì Model đã tự làm ở bước .save()
    // Chúng ta chỉ cần truyền password vào trường passwordHash
    const newUser = await User.create({
      name,
      email,
      passwordHash: password, // Model sẽ tự động hash cái này trước khi lưu
      role: "user"
    });

    // Trả về kết quả
    res.status(201).json({ 
      ok: true, 
      message: "Đăng ký thành công! Chào mừng bạn đến với Shoply 🎁",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      } 
    });
  } catch (error) {
    console.error("❌ Lỗi Đăng ký:", error);
    res.status(500).json({ ok: false, message: "Lỗi hệ thống Noel, không thể tạo tài khoản" });
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

    // TỐI ƯU: Sử dụng phương thức comparePassword đã định nghĩa ở Model (Bước 4)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ ok: false, message: "Email hoặc mật khẩu không đúng 🎄" });
    }

    // Đăng nhập thành công
    res.status(200).json({
      ok: true,
      message: "Đăng nhập thành công! Chúc bạn mua sắm vui vẻ ❄",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("❌ Lỗi Đăng nhập:", error);
    res.status(500).json({ ok: false, message: "Lỗi hệ thống Noel, vui lòng thử lại sau" });
  }
};