import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types/product";

export type ProductsResponse = {
  data: Product[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
};

// Bước 1: Bổ sung thêm 'sub' vào định nghĩa tham số (args)
export function useProductsQuery(args: { 
  page: number; 
  limit: number; 
  q?: string; 
  category?: string;
  sub?: string; // <--- Thêm trường này để nhận diện danh mục phụ (Hạt, Ướt, Đồ chơi...)
}) {
  const { page, limit, q, category, sub } = args;

  return useQuery<ProductsResponse>({
    // Bước 2: Thêm sub vào queryKey để React Query tự động tải lại khi đổi mục con
    queryKey: ["products", { page, limit, q: q ?? "", category: category ?? "", sub: sub ?? "" }],
    
    queryFn: async () => {
      const params = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit) 
      });

      if (q) params.set("q", q);
      
      // Đưa category vào URL
      if (category) params.set("category", category);

      // Bước 3: Đưa sub vào URL gửi lên API để Backend thực hiện lọc
      if (sub) params.set("sub", sub);

      const res = await fetch(`/api/products?${params.toString()}`);
      
      if (!res.ok) throw new Error("Failed to fetch products");
      return (await res.json()) as ProductsResponse;
    },
    placeholderData: (prev) => prev,
  });
}