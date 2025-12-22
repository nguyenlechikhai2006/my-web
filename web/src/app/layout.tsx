import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter"; // 1. Import Footer
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Keddy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900">
        <Providers>
          {/* Sử dụng cấu trúc flex-col và min-h-screen trên thẻ bọc ngoài cùng 
            để đảm bảo Footer bị đẩy xuống dưới cùng của trình duyệt.
          */}
          <div className="flex flex-col min-h-screen">
            <SiteHeader />
            
            {/* flex-grow giúp phần nội dung này chiếm lấy toàn bộ không gian còn trống,
              từ đó đẩy Footer xuống đáy trang.
            */}
            <main className="flex flex-col w-full flex-grow">
              {children}
            </main>

            <SiteFooter /> {/* 2. Bổ sung Footer vào đây */}
          </div>
        </Providers>
      </body>
    </html>
  );
}