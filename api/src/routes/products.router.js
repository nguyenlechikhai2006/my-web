const express = require("express");
const { createProduct, updateProduct, deleteProduct } = require("../controllers/products.controller");
const { createProductSchema, updateProductSchema } = require("../schemas/product.dto");
const { validate } = require("../middlewares/validate");
const { asyncHandler } = require("../utils/async");
const { Product } = require("../models/product.model");
const router = express.Router();
const { requireAuth, requireRole } = require("../middlewares/auth");

// GET /api/v1/products?page=&limit=&q=
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 50);
    const q = String(req.query.q || "").trim();

    const filter = q
      ? {
          $or: [
            { title: new RegExp(q, "i") },
            { brand: new RegExp(q, "i") },
            { category: new RegExp(q, "i") },
          ],
        }
      : {};

    const total = await Product.countDocuments(filter);
    const data = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const hasNext = page * limit < total;
    res.json({ data, page, limit, total, hasNext });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/products/slug/:slug
// Chấp nhận slug có/không số 0 trước số thứ tự.
// Ví dụ: "san-pham-1" sẽ thử tìm ["san-pham-1", "san-pham-01", "san-pham-001"].
router.get("/slug/:slug", async (req, res, next) => {
  try {
    const raw = (req.params.slug || "").toLowerCase().trim();
    
    // Luôn thử chính xác trước
    const candidates = new Set([raw]);
    
    // Nếu có pattern ...-<number> thì thêm biến thể có padding 2 & 3
    const m = raw.match(/^(.*-)(\d+)$/);
    if (m) {
      const base = m[1];
      const num = m[2];
      candidates.add(base + num.padStart(2, "0")); // 01
      candidates.add(base + num.padStart(3, "0")); // 001
    }
    
    // Tìm theo danh sách ứng viên
    const p = await Product.findOne({ slug: { $in: Array.from(candidates) } })
      .select("_id slug title price images stock")
      .lean();
    
    if (!p) {
      return res
        .status(404)
        .json({ ok: false, error: { code: "PRODUCT_NOT_FOUND", message: "Product not found" } });
    }
    
    return res.json({ ok: true, product: p });
  } catch (e) {
    next(e);
  }
});

// Create
router.post("/", requireAuth, requireRole("admin"), validate(createProductSchema, "body"), (req, res, next) =>
  Promise.resolve(createProduct(req, res, next)).catch(next)
);

// Update
router.patch("/:id", requireAuth, requireRole("admin"), validate(updateProductSchema, "body"), (req, res, next) =>
  Promise.resolve(updateProduct(req, res, next)).catch(next)
);

// Delete
router.delete("/:id", requireAuth, requireRole("admin"), (req, res, next) =>
  Promise.resolve(deleteProduct(req, res, next)).catch(next)
);

module.exports = router;