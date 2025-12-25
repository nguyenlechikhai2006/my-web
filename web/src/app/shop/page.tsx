"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { ShoppingBag, Search, ChevronLeft, ChevronRight, Snowflake } from "lucide-react";

const LIMIT = 12;

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = useMemo(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const qParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const subParam = searchParams.get("sub") || "";

  const [qInput, setQInput] = useState(qParam);
  useEffect(() => setQInput(qParam), [qParam]);

  const queryArgs = useMemo(() => ({ 
    page: pageParam, 
    limit: LIMIT, 
    q: qParam.trim() || undefined,
    category: categoryParam || undefined,
    sub: subParam || undefined
  }), [pageParam, qParam, categoryParam, subParam]);
  
  const { data, isLoading, isError, error } = useProductsQuery(queryArgs);

  function setUrl(next: { page?: number; q?: string | null }) {
    const sp = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q && next.q.trim()) {
        sp.set("q", next.q.trim());
      } else {
        sp.delete("q");
      }
      sp.set("page", "1");
    } else if (typeof next.page === "number") {
      sp.set("page", String(next.page));
    }
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    /* Đổi nền sang màu xanh tuyết nhạt và thêm hiệu ứng tuyết rơi */
    <main className="min-h-screen bg-[#f8fbff] py-10 relative overflow-hidden">
      
      {/* HIỆU ỨNG TUYẾT RƠI NỀN (Bổ sung mới) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        {[...Array(15)].map((_, i) => (
          <Snowflake 
            key={i} 
            size={Math.random() * 20 + 10} 
            className="absolute text-blue-200 animate-bounce" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        
        {/* Header trang trí Noel (Bổ sung trang trí) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-[#C41E3A] italic flex items-center justify-center md:justify-start gap-3 drop-shadow-sm">
              <span className="text-3xl animate-bounce">🎄</span>
              CỬA HÀNG KEDDY
              <span className="text-3xl animate-pulse">🎁</span>
            </h1>
            <p className="text-green-700 mt-2 font-bold flex items-center justify-center md:justify-start gap-2">
              <Snowflake size={16} />
              {qParam ? `Kết quả cho "${qParam}"` : 
               subParam ? `Danh mục: ${subParam.toUpperCase()}` : "Ưu đãi Giáng sinh cho thú cưng"}
            </p>
          </div>

          {/* Form tìm kiếm phong cách Noel (Sửa màu sắc) */}
          <form
            className="flex w-full md:w-96 bg-white rounded-2xl shadow-lg border-2 border-red-100 focus-within:border-red-500 overflow-hidden transition-all"
            onSubmit={(e) => {
              e.preventDefault();
              setUrl({ q: qInput });
            }}
          >
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Tìm quà tặng cho Pet..."
              className="h-12 px-5 flex-grow text-sm focus:outline-none text-black bg-white"
            />
            <button type="submit" className="bg-[#C41E3A] text-white px-5 hover:bg-red-700 transition-colors">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Loading Skeleton (Giữ nguyên logic) */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 bg-white rounded-[32px] border-2 border-red-50 shadow-sm" />
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-600 text-center font-bold">
            🎅 Ôi! Có lỗi nhỏ khi lấy quà: {(error as any)?.message || "Vui lòng thử lại sau"}
          </div>
        )}

        {/* Danh sách sản phẩm (Bổ sung hiệu ứng Hover) */}
        {data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.data.map((p: any) => (
              <div key={p._id} className="hover:-translate-y-3 transition-transform duration-500">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="bg-white rounded-[40px] p-20 text-center shadow-xl border-4 border-dashed border-red-100">
              <span className="text-8xl mb-4 block animate-wobble">🎅</span>
              <p className="text-xl font-bold text-slate-800">Keddy chưa cập nhật sản phẩm mục này hehe...</p>
              <button 
                onClick={() => router.push(pathname)}
                className="mt-6 px-8 py-3 bg-green-700 text-white rounded-full font-bold hover:bg-red-600 transition-colors shadow-lg"
              >
                Quay lại xem tất cả sản phẩm
              </button>
            </div>
          )
        )}

        {/* Phân trang Noel (Sửa màu sắc đồng bộ) */}
        {data && data.data && data.data.length > 0 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              className="h-12 px-6 rounded-full bg-white border-2 border-red-100 shadow-md text-red-600 font-bold hover:bg-red-50 disabled:opacity-30 transition-all flex items-center gap-2"
              onClick={() => setUrl({ page: pageParam - 1 })}
              disabled={pageParam <= 1}
            >
              <ChevronLeft size={20} /> Trước
            </button>
            
            <span className="bg-[#C41E3A] text-white min-w-[3rem] h-12 px-6 flex items-center justify-center rounded-full font-black shadow-xl ring-4 ring-red-100">
                {data?.page || pageParam}
            </span>
            
            <button
              className="h-12 px-6 rounded-full bg-white border-2 border-red-100 shadow-md text-red-600 font-bold hover:bg-red-50 disabled:opacity-30 transition-all flex items-center gap-2"
              onClick={() => setUrl({ page: pageParam + 1 })}
              disabled={!data?.hasNext}
            >
              Sau <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}