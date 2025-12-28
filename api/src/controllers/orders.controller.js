const Order = require("../models/order.model");
// Lưu ý: Không cần import connectMongo ở đây nữa vì chúng ta đã kết nối tập trung tại server.js rồi.
// Việc gọi connectMongo() mỗi lần chạy API sẽ làm chậm tốc độ phản hồi.

// 1. TẠO ĐƠN HÀNG MỚI (Lưu vào MongoDB)
exports.createOrder = async (req, res) => {
  try {
    // Logic: Lấy dữ liệu từ Frontend gửi lên qua req.body
    // Nhờ middleware express.json() ở app.js, req.body sẽ chứa đầy đủ thông tin giỏ hàng
    const newOrder = new Order(req.body);
    
    // Lưu vào MongoDB
    const savedOrder = await newOrder.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Đặt hàng thành công! Đơn hàng đã được lưu vào hệ thống 🎅",
      data: savedOrder 
    });
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi khi lưu đơn hàng: " + error.message 
    });
  }
};

// 2. LẤY LỊCH SỬ ĐƠN HÀNG (Dành cho trang Profile)
exports.getUserOrders = async (req, res) => {
  try {
    // Lấy email từ URL params (ví dụ: /api/v1/orders/user/admin@shoply.local)
    const { email } = req.params; 

    if (!email) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin email" });
    }
    
    // Tìm các đơn hàng liên quan đến email này
    // Sắp xếp theo thời gian mới nhất lên đầu (createdAt: -1)
    const orders = await Order.find({ email: email.toLowerCase() })
                              .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: orders.length,
      data: orders 
    });
  } catch (error) {
    console.error("❌ Lỗi lấy lịch sử đơn hàng:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Không thể lấy lịch sử đơn hàng: " + error.message 
    });
  }
};