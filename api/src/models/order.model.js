const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  // Thông tin khách hàng
  customerName: { type: String, required: [true, "Tên khách hàng là bắt buộc"] },
  customerPhone: { type: String, required: [true, "Số điện thoại là bắt buộc"] },
  customerAddress: { type: String, required: [true, "Địa chỉ giao hàng là bắt buộc"] },
  email: { type: String, required: true },

  // Chi tiết giỏ hàng
  items: [
    {
      // SỬA TẠI ĐÂY: Thay mongoose.Schema.Types.ObjectId bằng String
      // Đồng thời bỏ ref: "Product" nếu bạn không dùng collection Product riêng biệt
      productId: { type: String, required: true }, 
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      image: String
    }
  ],

  // Thanh toán
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ["cod", "banking", "momo"], 
    default: "cod" 
  },
  
  // Trạng thái đơn hàng
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
    default: "pending" 
  }
}, { 
  timestamps: true,
  versionKey: false 
});

module.exports = mongoose.model("Order", OrderSchema);