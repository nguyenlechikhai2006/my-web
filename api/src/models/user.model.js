const bcrypt = require('bcrypt');
const { User } = require('./models/User'); // File Mongoose bạn vừa gửi
const { registerSchema } = require('./schemas/zod'); // File Zod trước đó

const registerUser = async (req, res) => {
  try {
    // 1. Validate bằng Zod
    const validatedData = registerSchema.parse(req.body);

    // 2. Kiểm tra email tồn tại chưa
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) return res.status(400).json({ message: "Email đã được dùng" });

    // 3. Hash mật khẩu (Sử dụng bcrypt)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // 4. Lưu vào MongoDB qua Mongoose
    const newUser = new User({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash: hashedPassword, // Lưu cái đã băm vào trường passwordHash
    });

    await newUser.save();
    res.status(201).json(newUser); // JSON trả về sẽ tự động mất passwordHash nhờ vào transform của bạn
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};