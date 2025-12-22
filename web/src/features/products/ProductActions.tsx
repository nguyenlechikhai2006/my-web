"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Snowflake, CreditCard } from "lucide-react";
import { formatVND } from "@/lib/format";
import { useCart } from "@/features/cart/cart-context";

interface ProductActionsProps {
  product: {
    _id: string; 
    title: string;
    price: number;
    flavors?: string[] | null;
    sizes?: { label: string; extra: number }[] | null; 
    stock: number;
    images: string[];
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const outOfStock = product.stock <= 0;
  const basePrice = product.price + (selectedSize?.extra || 0);

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      id: `${product._id}-${selectedSize?.label || 'default'}-${selectedFlavor || 'none'}`,
      productId: product._id,
      image: product.images?.[0] || "",
      // SỬA 1: Đổi cartQuantity thành quantity để Header nhận được số lượng
      quantity: Number(quantity), 
      selectedSize: selectedSize?.label, 
      selectedFlavor: selectedFlavor,
      // SỬA 2: Ép kiểu Number chuẩn để không bao giờ bị NaN
      price: Number(product.price || 0) + Number(selectedSize?.extra || 0), 
    };

    addItem(itemToAdd);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-8 mt-6">
      {/* 1. CHỌN HƯƠNG VỊ */}
      {product.flavors && product.flavors.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
            Hương Vị: <span className="text-red-600 font-medium normal-case">{selectedFlavor}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.flavors.map((flavor) => (
              <button
                key={flavor}
                type="button"
                onClick={() => setSelectedFlavor(flavor)}
                className={`px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedFlavor === flavor
                    ? "border-red-600 bg-red-50 text-red-600 shadow-sm"
                    : "border-gray-100 hover:border-red-200 text-gray-600 bg-white"
                }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. CHỌN KÍCH THƯỚC */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
            Kích thước: <span className="text-red-600 font-medium normal-case">{selectedSize?.label}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.label}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-2 border-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedSize?.label === size.label
                    ? "border-red-600 bg-red-50 text-red-600 shadow-sm"
                    : "border-gray-100 hover:border-red-200 text-gray-600 bg-white"
                }`}
              >
                {size.label}
                {size.extra > 0 && (
                  <span className="ml-1 text-[10px] opacity-70">
                    (+{formatVND(size.extra)})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. SỐ LƯỢNG */}
      <div className="flex flex-col gap-4 py-6 border-y border-dashed border-red-100 bg-red-50/30 rounded-2xl px-4">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          Số Lượng: <Snowflake size={14} className="text-blue-300 animate-pulse" />
        </h4>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center w-36 border-2 border-red-100 rounded-2xl p-1 bg-white shadow-sm">
            <button
              type="button"
              disabled={outOfStock || quantity <= 1}
              onClick={() => setQuantity(prev => prev - 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-red-50 rounded-xl transition disabled:opacity-30"
            >
              <Minus size={18} />
            </button>
            <span className="flex-1 text-center font-black text-lg">{quantity}</span>
            <button
              type="button"
              disabled={outOfStock || quantity >= product.stock}
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-red-50 rounded-xl transition disabled:opacity-30"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Tổng cộng Noel</p>
            <p className="text-3xl font-black text-[#C41E3A] leading-none">
              {/* SỬA 3: Dùng biến basePrice đã tính sẵn thay vì tính lại trong render */}
              {formatVND(basePrice * quantity)}
            </p>
          </div>
        </div>
      </div>

      {/* 4. NÚT BẤM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          type="button"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className="h-14 rounded-2xl border-2 border-green-600 text-green-700 font-bold hover:bg-green-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
        >
          <ShoppingCart size={20} />
          THÊM VÀO GIỎ
        </button>
        <button 
          type="button"
          disabled={outOfStock}
          onClick={handleBuyNow}
          className="h-14 rounded-2xl bg-[#C41E3A] text-white font-black hover:bg-red-700 shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 disabled:opacity-50 disabled:grayscale"
        >
          <CreditCard size={20} />
          Mua ngay 🎁
        </button>
      </div>
    </div>
  );
}