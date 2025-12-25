const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// SỬA LỖI TẠI ĐÂY: Vì app.js nằm trong src, gọi trực tiếp thư mục db
const { connectMongo, bindMongoLogs } = require("./db/mongoose"); 

const app = express();

// 1. KẾT NỐI DATABASE
connectMongo();
bindMongoLogs();

// 2. CẤU HÌNH MIDDLEWARE
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS theo ENV
const allowOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: allowOrigin, credentials: true }));

// Body parser & logger
app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 3. ĐỊNH NGHĨA ROUTES
app.get("/", (req, res) => {
  res.json({ ok: true, service: "shoply-api", version: "v1.0.0" });
});

// SỬA LỖI TẠI ĐÂY: Gọi trực tiếp vào thư mục routes cùng cấp với app.js
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