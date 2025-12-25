const express = require("express");
const { register, login, me } = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../schemas/auth.dto");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
module.exports = router;