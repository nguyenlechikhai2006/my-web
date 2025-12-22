import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = { title: "Shop-Keddy" };

// 1. Thêm async vào function
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  
  // 2. Thêm await trước headers()
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "/shop";
  
  const isDetail = pathname.startsWith("/shop/") && pathname.split("/").length > 2;

  return (
    <section>
      {/* Khối nội dung đã lược bỏ */}
      {children}
    </section>
  );
}