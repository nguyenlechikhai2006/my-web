const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import cấu hình DB
const { connectMongo, bindMongoLogs } = require("./db/mongoose");

const app = express();

// 1. KẾT NỐI DATABASE
// Gọi bindMongoLogs trước để đăng ký các sự kiện lắng nghe (connected, error...)
bindMongoLogs();
connectMongo().catch(err => {
  console.error("❌ Lỗi khởi tạo Database ban đầu:", err.message);
});

// 2. CẤU HÌNH MIDDLEWARE
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: false }));

// TỐI ƯU CORS: Cho phép nhiều nguồn (Localhost và Render)
const allowedOrigins = [
  "http://localhost:3000",
  "https://keddy-web-cua-toi.onrender.com" // Link từ hình số 3 của bạn
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Cho phép các request không có origin (như Postman hoặc mobile app) 
    // hoặc origin nằm trong danh sách allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Chặn bởi CORS: Nguồn này không được phép truy cập"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

// Body parser: Giải mã dữ liệu JSON từ client gửi lên (quan trọng cho Đăng nhập/Giỏ hàng)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Thêm cái này để xử lý form data nếu cần

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 3. ĐỊNH NGHĨA ROUTES
app.get("/", (req, res) => {
  res.json({ 
    ok: true, 
    service: "shoply-api", 
    version: "1.0.0",
    database: "connected" 
  });
});

// Load các router
const authRouter = require("./routes/auth.router");
const productsRouter = require("./routes/products.router");
const ordersRouter = require("./routes/orders.router");
// BỔ SUNG: Khai báo paymentRouter để tránh lỗi ReferenceError
const paymentRouter = require("./routes/payment.router"); 

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);
// Đã có sẵn dòng này, giờ đã có biến paymentRouter để chạy
app.use("/api/v1/payments", paymentRouter);

// 4. XỬ LÝ LỖI (ERROR HANDLING)
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: { code: "NOT_FOUND", message: `Route ${req.originalUrl} không tồn tại` },
  });
});

// Error Handler chuẩn JSON
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  
  console.error("🔥 Hệ thống gặp lỗi:", err.stack); // Dùng err.stack để debug chi tiết hơn

  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    error: { 
      code: err.code || "INTERNAL_ERROR", 
      message: err.message || "Lỗi máy chủ nội bộ" 
    }
  });
});

module.exports = app;