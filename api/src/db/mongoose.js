const mongoose = require("mongoose");
require("dotenv").config();

// Lấy URI từ biến môi trường
const uri = process.env.MONGODB_URI;
// Tên database mặc định là 'shoply' nếu trong .env không có MONGODB_DB
const dbName = process.env.MONGODB_DB || "shoply";

let isConnected = false;

async function connectMongo() {
  // Nếu đã kết nối rồi thì không kết nối lại để tránh lãng phí tài nguyên
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  if (!uri) {
    console.error("✖ LỖI: Không tìm thấy MONGODB_URI trong file .env!");
    return; // Không dùng process.exit(1) để tránh crash app đột ngột trên Render
  }

  try {
    await mongoose.connect(uri, {
      dbName: dbName,
      // Các tùy chọn tối ưu cho kết nối Cloud Atlas
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
  } catch (err) {
    console.error("✖ Lỗi kết nối MongoDB:", err.message);
    isConnected = false;
  }
}

function bindMongoLogs() {
  const conn = mongoose.connection;
  
  // Tránh gắn lại listener nếu đã có rồi
  if (conn.listeners('connected').length === 0) {
    conn.on("connected", () => {
      console.log(`✔ Đã kết nối Database: ${dbName}`);
    });

    conn.on("error", (err) => {
      console.error("✖ Lỗi kết nối Database:", err.message);
    });

    conn.on("disconnected", () => {
      console.warn("⚠ Đã ngắt kết nối Database");
      isConnected = false;
    });
  }
}

module.exports = { connectMongo, bindMongoLogs };