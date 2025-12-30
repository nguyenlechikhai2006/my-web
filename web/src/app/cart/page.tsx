"use client";

import { useCart } from "@/features/cart/cart-context";
import { formatVND } from "@/lib/format";
import { Minus, Plus, Snowflake, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { state, removeItem, updateQuantity, subtotal, hydrated } = useCart();
  const router = useRouter();

  if (!hydrated) return <div className="p-20 text-center text-gray-500 italic">Đang chuẩn bị quà Noel...</div>;

  // TRƯỜNG HỢP 1: GIỎ HÀNG TRỐNG
  if (state.items.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <ShoppingBag size={64} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 uppercase">Giỏ hàng Noel đang trống 🎁</h2>
        <Link href="/shop" className="text-[#C41E3A] font-bold hover:underline uppercase tracking-widest">
          Quay lại chọn quà ngay
        </Link>
      </div>
    );
  }

  // TRƯỜNG HỢP 2: CÓ SẢN PHẨM
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <button 
        onClick={() => router.back()} 
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-[#C41E3A] font-bold transition-colors uppercase text-xs tracking-widest"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <h1 className="text-3xl font-bold mb-10 text-[#C41E3A] italic uppercase tracking-tighter flex items-center gap-3">
        Giỏ hàng của bạn <Snowflake className="text-blue-300 animate-pulse" size={24} />
      </h1>
      
      <div className="flex flex-col gap-6">
        {state.items.map((item: any, index: number) => {
          // CHỈNH SỬA: Sử dụng itemId đồng nhất với logic đã sửa trong cart-context
          const itemId = item.id || item.productId;

          return (
            // SỬA KEY: Sử dụng itemId làm key chính để React tracking chuẩn xác hơn index
            <div key={itemId} className="flex gap-6 p-5 bg-white rounded-3xl border-2 border-red-50 items-center shadow-sm">
              <img 
                src={item.image} 
                alt={item.title || item.name} 
                className="w-24 h-24 object-cover rounded-2xl border border-red-100" 
              />
              
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 uppercase tracking-tight">
                  {item.title || item.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {item.selectedFlavor && `Hương vị: ${item.selectedFlavor}`} 
                  {item.selectedSize && ` | Kích thước: ${item.selectedSize}`}
                  {/* Hiển thị thêm Brand nếu có để giống thiết kế cũ */}
                  {item.brand && ` | ${item.brand}`}
                </p>
                <p className="text-[#C41E3A] font-black text-xl mt-2">{formatVND(item.price)}</p>
              </div>
              
              {/* Bộ tăng giảm số lượng */}
              <div className="flex items-center gap-3 bg-red-50/50 p-2 rounded-2xl border-2 border-red-100">
                <button 
                  // SỬA: Đảm bảo truyền đúng itemId đã trích xuất ở trên
                  onClick={() => updateQuantity(itemId, Math.max(1, (Number(item.quantity) || 0) - 1))} 
                  className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-xl transition shadow-sm bg-white/50"
                >
                  <Minus size={16} />
                </button>
                <span className="font-black text-lg w-6 text-center">{item.quantity || 0}</span>
                <button 
                  onClick={() => updateQuantity(itemId, (Number(item.quantity) || 0) + 1)} 
                  className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-xl transition shadow-sm bg-white/50"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={() => removeItem(itemId)} 
                className="p-3 text-gray-300 hover:text-[#C41E3A] transition-colors"
              >
                <Trash2 size={22} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Tổng cộng & Nút chuyển sang Checkout */}
      <div className="mt-12 p-8 bg-[#C41E3A] rounded-[2rem] text-white flex flex-col md:flex-row gap-6 justify-between items-center shadow-2xl shadow-red-200">
        <div>
          <p className="text-xs opacity-90 uppercase font-bold tracking-[0.2em]">Tổng cộng Noel</p>
          <p className="text-4xl font-black leading-none mt-1">{formatVND(subtotal || 0)}</p>
        </div>
        <Link 
          href="/checkout" 
          className="bg-white text-[#C41E3A] px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-lg text-center"
        >
          Thanh toán ngay 🎁
        </Link>
      </div>
    </div>
  );
}