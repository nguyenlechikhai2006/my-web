require("dotenv").config();
const app = require("./app");
const { connectMongo, bindMongoLogs } = require("./db/mongoose");

const PORT = process.env.PORT || 4000;

bindMongoLogs();

// ✅ MỞ SERVER TRƯỚC
app.listen(PORT, () => {
  console.log(`▶ Shoply API listening at http://localhost:${PORT}`);
});

// ✅ Mongo chạy nền
connectMongo().catch(err => {
  console.error("❌ Mongo connect failed:", err.message);
});
