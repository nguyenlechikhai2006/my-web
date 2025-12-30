"use client";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatVND } from "@/lib/format";
import AddToCartButton from "@/features/cart/AddToCartButton";
import { Settings2, Snowflake } from "lucide-react"; 

export type ProductCardProps = { product: Product };

export default function ProductCard({ product }: ProductCardProps) {
  // GIỮ NGUYÊN DESTRUCTURING CŨ
  const { title, price, originalPrice, slug, images, stock, brand, rating, _id } = product;
  
  const image = (images && images.length > 0) ? images[0] : "https://via.placeholder.com/512";
  const outOfStock = (stock ?? 0) <= 0;
  const isDeal = originalPrice && originalPrice > price;
  const isAdmin = true; 

  // BỔ SUNG: Tạo một object chuẩn để AddToCartButton và Context luôn đọc được ID
  const normalizedProduct = {
    ...product,
    id: _id, // Đảm bảo luôn có id để context findIndex chính xác
    name: title, // Đồng bộ title thành name nếu context dùng name
    image: image
  };

  return (
    <div className="border-2 border-red-50 rounded-xl overflow-hidden bg-white hover:shadow-[0_0_15px_rgba(196,30,58,0.2)] transition-all duration-300 relative group">
      
      {/* NHÃN GIÁNG SINH */}
      {isDeal && (
        <div className="absolute -left-10 top-5 -rotate-45 bg-red-600 text-white text-[10px] font-bold py-1 px-10 z-20 shadow-sm uppercase tracking-wider">
          Gift 🎁
        </div>
      )}

      <Link href={`/shop/${slug}`} className="block">
        <div className="relative aspect-square bg-[#fdfcfc]">
          <Image 
            src={image} 
            alt={title || "Product Image"} 
            width={512} 
            height={512} 
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />
          
          {/* BADGE TRẠNG THÁI CÓ ICON TUYẾT */}
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 items-end">
            {outOfStock ? (
              <span className="text-[10px] bg-gray-400 text-white px-2 py-1 rounded-full">Hết hàng</span>
            ) : (
              <span className="text-[10px] bg-green-700 text-white px-2 py-1 rounded-full flex items-center gap-1">
                <Snowflake size={10} className="animate-spin-slow" /> Còn {stock}
              </span>
            )}
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-red-700 transition-colors">
            {title}
          </h3>
          
          <div className="mt-2 flex items-center gap-2">
            <p className="font-black text-[#C41E3A] text-base">{formatVND(price)}</p>
            {isDeal && (
              <p className="text-xs text-gray-400 line-through decoration-red-400">
                {formatVND(originalPrice)}
              </p>
            )}
          </div>
          
          <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-2 mb-2 italic">
            {brand && <span className="text-green-700 font-medium">{brand}</span>}
            {typeof rating === "number" && <span className="text-yellow-500">★ {rating}</span>}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        {/* SỬA: Truyền normalizedProduct thay vì product gốc */}
        <AddToCartButton product={normalizedProduct} disabled={outOfStock} />
      </div>
    </div>
  );
}