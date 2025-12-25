const express = require("express");
const { createOrder, getOrderById, listOrders } = require("../controllers/orders.controller");
const { createOrderSchema } = require("../schemas/order.dto");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

// Đường dẫn đúng đến controller (nhìn vào cột Explorer của bạn là orders.controller.js)
const orderController = require("../controllers/orders.controller"); 

// Định nghĩa route POST để lưu đơn hàng
router.post("/", orderController.createOrder);
router.get("/user/:email", orderController.getUserOrders);

module.exports = router;