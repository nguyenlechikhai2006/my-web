// Chỉ lấy link gốc từ Render (Ví dụ: https://keddy-api1.onrender.com)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // LUÔN LUÔN chèn /api/v1 vào giữa link gốc và path
  const url = path.startsWith("http") 
    ? path 
    : `${BASE_URL}/api/v1${cleanPath}`;

  console.log("🚀 Đang gọi thực tế đến:", url); // Thêm dòng này để bạn nhìn thấy link trong Console

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, { 
      ...options, 
      headers, 
      cache: "no-store" 
    });

    if (!res.ok) {
      let message = `Lỗi ${res.status}: ${res.statusText}`;
      try { 
        const errorData = await res.json(); 
        message = errorData?.error?.message || errorData?.message || message; 
      } catch (e) {}
      throw new Error(message);
    }

    return res.json() as Promise<T>;
  } catch (error: any) {
    console.error("🌐 API Fetch Error:", error.message);
    throw error;
  }
}