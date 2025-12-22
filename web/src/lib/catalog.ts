import type { Product } from "@/types/product";
import type { MinProduct } from "@/mock/min-products";
import { PRODUCTS } from "@/mock/products";
import { MIN_PRODUCTS } from "@/mock/min-products";

export function toProduct(p: MinProduct): Product {
  return {
    _id: `legacy-${p.slug}`,
    title: p.title,
    slug: p.slug,
    price: p.price,
    images: [p.image ?? "/placeholder.svg"],
    stock: p.stock ?? 0,
    // Bổ sung các giá trị mặc định để tránh lỗi giao diện
    brand: "Keddy",
    description: "Sản phẩm đang được cập nhật nội dung chi tiết.",
  };
}

export function asProduct(p: Product | MinProduct): Product {
  const maybe = p as Product;
  if (typeof maybe._id === "string" && Array.isArray(maybe.images)) return maybe;
  return toProduct(p as MinProduct);
}

// 🔧 Cập nhật hàm tìm kiếm: Ưu tiên lấy từ PRODUCTS (nơi có đầy đủ mô tả)
export function getProductBySlug(slug: string): Product | null {
  // Tìm trong danh sách sản phẩm đầy đủ trước
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (p) return p as unknown as Product; // Ép kiểu để khớp với interface Product của bạn

  // Nếu không thấy mới tìm trong danh sách rút gọn
  const m = MIN_PRODUCTS.find((x) => x.slug === slug);
  return m ? toProduct(m) : null;
}