const Order = require("../models/order.model");
const { connectMongo } = require("../db/mongoose"); // Kết nối từ file mongoose.js của bạn

// 1. TẠO ĐƠN HÀNG MỚI (Lưu vào MongoDB)
exports.createOrder = async (req, res) => {
  try {
    await connectMongo(); // Đảm bảo đã kết nối Database trước khi xử lý
    
    // Tạo đối tượng đơn hàng từ dữ liệu Frontend gửi lên (body)
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Đặt hàng thành công! 🎅",
      data: savedOrder 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Lỗi khi lưu đơn hàng: " + error.message 
    });
  }
};

// 2. LẤY LỊCH SỬ ĐƠN HÀNG (Dành cho trang Profile)
exports.getUserOrders = async (req, res) => {
  try {
    await connectMongo();
    
    // Lấy email từ tham số trên đường dẫn (URL params)
    const { email } = req.params; 
    
    // Tìm các đơn hàng có email trùng khớp trong database
    // Sắp xếp theo thời gian mới nhất lên đầu (createdAt: -1)
    const orders = await Order.find({ 
      $or: [{ customerEmail: email }, { email: email }] 
    }).sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: orders 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Không thể lấy lịch sử nhận quà: " + error.message 
    });
  }
};