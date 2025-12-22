"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/features/auth/schemas";
import { useState } from "react";
import { Snowflake, Gift, Bell, Star, Heart } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginValues>({ 
    resolver: zodResolver(loginSchema), 
    mode: "onChange" 
  });

  async function onSubmit(values: LoginValues) {
    setServerMsg(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json();
      setServerMsg(data?.message ?? "Đăng nhập thất bại");
      return;
    }
    setServerMsg("Chào mừng bạn quay lại! 🎄");
  }

  return (
    /**
     * PHẦN QUAN TRỌNG NHẤT ĐỂ PHỦ ĐẦY:
     * - w-full: Đảm bảo rộng 100% không có khoảng trắng.
     * - bg-[#c41e3a]: Màu đỏ Noel bao phủ toàn bộ vùng nền.
     * - min-h-[calc(100vh-140px)]: Chiều cao tối thiểu trừ đi Header để không bị hụt nền phía dưới.
     */
    <main className="relative w-full min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#4794EC] overflow-hidden">
      
      {/* 1. LỚP TRANG TRÍ TRÀN VIỀN (Lấp đầy 2 bên) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Họa tiết tuyết chìm phủ toàn màn hình */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/snow.png')` }}></div>
        
        {/* Các biểu tượng đặt sát mép màn hình để xóa bỏ cảm giác trống trải */}
        <Snowflake className="absolute top-[15%] left-[5%] animate-bounce text-white/40" size={48} />
        <Snowflake className="absolute top-[25%] right-[5%] animate-pulse text-white/30" size={56} />
        <Snowflake className="absolute bottom-[20%] left-[8%] animate-spin-slow text-white/20" size={32} />
        <Snowflake className="absolute bottom-[10%] right-[10%] animate-bounce text-white/20" size={40} />
        <Star className="absolute top-[45%] left-[2%] animate-pulse text-yellow-200/40" size={24} />
        <Heart className="absolute bottom-10 left-10 text-white/10 fill-white hidden lg:block" size={120} />
      </div>

      {/* 2. FORM ĐĂNG NHẬP TRUNG TÂM (Theo mẫu ảnh bạn gửi) */}
      <div className="relative z-10 w-full max-w-[420px] mx-4 my-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden border-[10px] border-[#138713]">
          
          {/* Header Xanh Thông */}
          <div className="bg-[#1a472a] p-8 text-center relative">
            <Gift className="absolute top-4 left-4 text-red-400 rotate-12" size={32} />
            <Bell className="absolute top-4 right-4 text-yellow-400 -rotate-12" size={32} />
            
            <h1 className="text-3xl font-black text-white uppercase tracking-normal leading-normal">
              ĐĂNG NHẬP <br/> <span className="text-[#ff4d4d]"></span>
            </h1>
            <div className="h-1.5 w-16 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
            <p className="text-white/70 text-[10px] mt-2 font-bold uppercase tracking-widest">Keddy Pet Shop</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-[#D92020] tracking-wider ml-1">Email*</label>
              <input
                type="email"
                className={`w-full bg-slate-50 border-2 rounded-2xl h-12 px-4 focus:ring-4 focus:ring-red-50 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`}
                {...register("email")}
                placeholder="ten@example.com"
              />
              {errors.email && <p className="text-[10px] text-red-600 font-bold ml-2 italic">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-[#D92020] tracking-wider ml-1">Mật Khẩu*</label>
              <input
                type="password"
                className={`w-full bg-slate-50 border-2 rounded-2xl h-12 px-4 focus:ring-4 focus:ring-red-50 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`}
                {...register("password")}
                placeholder="••••••"
              />
              {errors.password && <p className="text-[10px] text-red-600 font-bold ml-2 italic">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full h-14 rounded-2xl bg-[#c41e3a] text-white font-black text-lg shadow-lg hover:bg-[#a01830] transition-all flex items-center justify-center gap-3 mt-4 active:scale-95"
            >
              {isSubmitting ? <Snowflake className="animate-spin" /> : <>Vào Cửa Hàng 🎅</>}
            </button>

            <div className="text-center pt-2">
              <Link href="/register" className="text-xs text-slate-500 font-medium hover:text-[#c41e3a]">
                Chưa có tài khoản? <span className="font-black border-b border-slate-300">Đăng ký nhận quà</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}