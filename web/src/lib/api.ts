const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  // 1. Tự động chuẩn hóa đường dẫn (Tránh việc thiếu dấu /)
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${BASE_URL}${cleanPath}`;

  const headers = new Headers(options.headers || {});
  
  // Chỉ set Content-Type là JSON nếu không phải gửi file (FormData)
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, { 
      ...options, 
      headers, 
      cache: "no-store" 
    });

    // 2. Xử lý khi có lỗi từ Server (Status code 4xx, 5xx)
    if (!res.ok) {
      let message = `Lỗi ${res.status}: ${res.statusText}`;
      try { 
        const errorData = await res.json(); 
        // Lấy message từ cấu hình error chuẩn mà mình đã sửa ở app.js
        message = errorData?.error?.message || errorData?.message || message; 
      } catch (e) {
        // Nếu không parse được JSON lỗi
      }
      throw new Error(message);
    }

    // 3. Trả về dữ liệu JSON
    return res.json() as Promise<T>;
  } catch (error: any) {
    console.error("🌐 API Fetch Error:", error.message);
    throw error;
  }
}