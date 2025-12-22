"use client";
import { useState } from "react";
import { PRODUCTS } from "@/mock/products";

export default function AdminPriceManager() {
  const [productList, setProductList] = useState(PRODUCTS);

  const handlePriceChange = (id: string, newPrice: string) => {
    const updated = productList.map(p => 
      p._id === id ? { ...p, price: parseInt(newPrice) || 0 } : p
    );
    setProductList(updated);
  };

  const saveChanges = () => {
    console.log("Dữ liệu giá mới:", productList);
    alert("Đã cập nhật giá tạm thời (Dữ liệu mock sẽ reset khi reload)");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#1e4eb8]">Quản lý giá sản phẩm</h1>
      <div className="bg-white rounded-2xl shadow-sm border">
        {productList.map((p) => (
          <div key={p._id} className="flex items-center justify-between p-4 border-b last:border-0">
            <div className="flex items-center gap-4">
              <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
              <span className="font-medium text-sm w-64 line-clamp-1">{p.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={p.price}
                onChange={(e) => handlePriceChange(p._id, e.target.value)}
                className="border rounded-lg px-3 py-2 w-32 text-right focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <span className="text-gray-500 font-bold">đ</span>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={saveChanges}
        className="fixed bottom-8 right-8 bg-yellow-400 text-[#1e4eb8] font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-all"
      >
        Lưu tất cả thay đổi
      </button>
    </div>
  );
}