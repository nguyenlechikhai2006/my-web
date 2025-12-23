const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let isConnected = false;

async function connectMongo() {
  if (isConnected) return;
  
  if (!uri) {
    console.error("✖ LỖI: Không tìm thấy MONGODB_URI trong file .env!");
    process.exit(1);
  }

  await mongoose.connect(uri, {
    dbName,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
}
function bindMongoLogs() {
  const conn = mongoose.connection;
  conn.on("connected", () => console.log(`✔ Mongo connected: ${uri}/${dbName}`));
  conn.on("error", (err) => console.error("✖ Mongo error:", err.message));
  conn.on("disconnected", () => console.warn("⚠ Mongo disconnected"));
}

module.exports = { connectMongo, bindMongoLogs };