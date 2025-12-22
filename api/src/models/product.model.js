const { Schema, model } = require("mongoose");

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  // THÊM 2 DÒNG NÀY ĐỂ LƯU SIZE VÀ VỊ VÀO COMPASS
  selectedSize: { type: String, default: "Default" },
  selectedFlavor: { type: String, default: "Default" }
}, { _id: false });

const OrderSchema = new Schema({
  orderCode: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  paymentMethod: { type: String, enum: ["cod", "banking", "momo"], required: true },
  note: { type: String },
  items: [OrderItemSchema], // Danh sách quà tặng Noel
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: "pending" }
}, { timestamps: true });

const Order = model("Order", OrderSchema);
module.exports = { Order };