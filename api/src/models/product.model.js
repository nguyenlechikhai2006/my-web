const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 },
  // Thêm các trường khác của sản phẩm nếu bạn cần
}, { timestamps: true });

// Kiểm tra và khởi tạo model
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = { Product };