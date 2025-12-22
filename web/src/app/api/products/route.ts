import { NextResponse } from "next/server";
import { PRODUCTS } from "@/mock/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.max(parseInt(searchParams.get("limit") || "12", 10), 1);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  
  // 1. Lấy thêm tham số category và sub từ URL
  const category = (searchParams.get("category") || "").trim().toLowerCase();
  const sub = (searchParams.get("sub") || "").trim().toLowerCase(); // BỔ SUNG: Lấy tham số sub

  let list = PRODUCTS;

  // 2. Logic lọc theo Category (Chó/Mèo/Phụ kiện...)
  if (category) {
    list = list.filter((p) => 
      p.category?.toLowerCase() === category
    );
  }

  // BỔ SUNG: Logic lọc theo Sub-category (Hạt/Ướt/Đồ chơi...)
  if (sub) {
    list = list.filter((p) => 
      p.sub?.toLowerCase() === sub
    );
  }

  // 3. Logic lọc theo từ khóa tìm kiếm (giữ nguyên của bạn)
  if (q) {
    list = list.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      (p.brand?.toLowerCase().includes(q) ?? false) ||
      (p.category?.toLowerCase().includes(q) ?? false)
    );
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = list.slice(start, end);
  const hasNext = end < total;

  return NextResponse.json({ data, page, limit, total, hasNext });
}