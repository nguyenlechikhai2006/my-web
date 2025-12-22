const mongoose = require("mongoose");

// Bỏ phần || "mongodb://localhost..." để nếu thiếu biến môi trường nó sẽ báo lỗi ngay thay vì chạy sai
const uri = process.env.MONGODB_URI; 
const dbName = process.env.MONGODB_DB || "keddy";

let isConnected = false;

async function connectMongo() {
  if (isConnected) return;

  if (!uri) {
    console.error("✖ LỖI: Chưa cấu hình MONGODB_URI trong Environment Variables!");
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("✔ Kết nối Database thành công!");
  } catch (err) {
    console.error("✖ Lỗi kết nối Mongo:", err.message);
  }
}

function bindMongoLogs() {
  const conn = mongoose.connection;
  conn.on("error", (err) => console.error("✖ Mongo error:", err.message));
  conn.on("disconnected", () => {
    console.warn("⚠ Mongo disconnected");
    isConnected = false;
  });
}

module.exports = { connectMongo, bindMongoLogs };