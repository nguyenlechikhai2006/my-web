// src/components/SiteFooter.tsx
"use client";
import Link from "next/link";
import { Snowflake, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Heart } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="relative bg-[#1e4eb8] text-white pt-20 pb-10 overflow-hidden w-full">
      {/* Hiệu ứng tuyết rơi */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 right-20 animate-spin-slow"><Snowflake size={40}/></div>
        <div className="absolute bottom-40 left-10 animate-pulse"><Snowflake size={20}/></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Cột 1: Thương hiệu */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-xl text-2xl">🐶</div>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">KEDDY PET</h2>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Những sản phẩm tốt nhất cho người bạn bốn chân. Chúc bạn một mùa Giáng Sinh an lành!
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="bg-white/10 p-3 rounded-full hover:bg-red-500 transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="text-yellow-400">🎁</span> Khám Phá
            </h4>
            <ul className="space-y-4 text-sm text-blue-100">
              <li><Link href="/shop" className="hover:text-yellow-400 transition-colors">Sản phẩm mới</Link></li>
              <li><Link href="/shop?sub=noel" className="hover:text-yellow-400 transition-colors">Ưu đãi Noel</Link></li>
              <li><Link href="/shop?sub=hat" className="hover:text-yellow-400 transition-colors">Thức ăn hạt</Link></li>
              <li><Link href="/shop?category=phu-kien" className="hover:text-yellow-400 transition-colors">Phụ kiện</Link></li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="text-red-400">🔔</span> Liên Hệ
            </h4>
            <ul className="space-y-4 text-sm text-blue-100">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 shrink-0" />
                <span>123 Đường Giáng Sinh, Phường Tuyết Trắng, TP. Keddy</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-yellow-400 shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-yellow-400 shrink-0" />
                <span>hello@keddypet.com</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký */}
          <div className="bg-white/10 p-6 rounded-[32px] border border-white/20">
            <h4 className="font-bold text-lg mb-4 italic text-yellow-400">Nhận Quà Noel!</h4>
            <p className="text-xs mb-4 text-blue-50">Để lại email để nhận mã giảm giá 30%.</p>
            <input 
              type="email" 
              placeholder="Email của bạn..." 
              className="w-full bg-white text-slate-800 px-4 py-3 rounded-2xl text-sm focus:outline-none"
            />
            <button className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95">
              ĐĂNG KÝ
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-blue-200 flex items-center justify-center gap-2 font-medium">
            Made with <Heart size={14} className="fill-red-500 text-red-500 animate-pulse" /> for Pets by KEDDY PET SHOP © 2025
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-white to-green-500"></div>
    </footer>
  );
}