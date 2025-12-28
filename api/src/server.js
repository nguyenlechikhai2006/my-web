require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const { connectMongo, bindMongoLogs } = require("./db/mongoose");

const PORT = process.env.PORT || 4000;

// 1. Đăng ký các sự kiện theo dõi log cho MongoDB
bindMongoLogs();

// 2. KHỞI CHẠY SERVER
const server = app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  
  // 3. KẾT NỐI MONGODB (Chạy ngay sau khi server lên)
  connectMongo().catch(err => {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
  });
});

// 4. XỬ LÝ LỖI KHÔNG MONG MUỐN (Tránh sập server đột ngột)
process.on("unhandledRejection", (err) => {
  console.log("🔥 LỖI CHƯA XỬ LÝ (Unhandled Rejection)! Đang đóng server...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// 5. ĐÓNG KẾT NỐI AN TOÀN (Khi deploy lại trên Render)
process.on("SIGTERM", () => {
  console.log("👋 Nhận tín hiệu SIGTERM. Đang đóng server và Database...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("✔ Đã đóng toàn bộ kết nối.");
      process.exit(0);
    });
  });
});