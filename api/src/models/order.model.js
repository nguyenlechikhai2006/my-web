const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  email: { type: String, required: true },
  items: Array, // Lưu danh sách sản phẩm từ giỏ hàng
  subtotal: Number,
  total: Number,
  paymentMethod: { type: String, default: "cod" },
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);