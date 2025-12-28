"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/features/auth/schemas";
import { useState } from "react";
import { Snowflake, Gift, Bell, Star, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { apiFetch } from "@/lib/api"; // Đảm bảo import đúng hàm apiFetch đã tối ưu

export default function LoginPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const router = useRouter(); 
  
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
    try {
      // 1. Sử dụng apiFetch để gọi đến endpoint /auth/login đã định nghĩa ở Backend
      const response = await apiFetch<{ ok: boolean; data: any; message?: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        const userData = response.data;
        
        // 2. Lưu thông tin đăng nhập vào LocalStorage
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userRole", userData.role || "user");
        
        // 3. Phát tín hiệu cập nhật trạng thái cho SiteHeader
        window.dispatchEvent(new Event("userLogin"));
        
        setServerMsg(`Chào mừng ${userData.name} quay lại cửa hàng Noel! 🎄`);

        // 4. Chuyển hướng về trang chủ sau 1 giây
        setTimeout(() => {
          window.location.href = "/"; 
        }, 1000);
      }
      
    } catch (error: any) {
      // Tự động lấy message lỗi từ Backend (ví dụ: "Email hoặc mật khẩu không đúng 🎄")
      setServerMsg(error.message || "Lỗi kết nối đến Server Noel. Vui lòng thử lại! ❄️");
    }
  }

  return (
    <main className="relative w-full min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#4794EC] overflow-hidden">
      
      {/* TRANG TRÍ NOEL */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/snow.png')` }}></div>
        
        <Snowflake className="absolute top-[15%] left-[5%] animate-bounce text-white/40" size={48} />
        <Snowflake className="absolute top-[25%] right-[5%] animate-pulse text-white/30" size={56} />
        <Snowflake className="absolute bottom-[20%] left-[8%] animate-spin-slow text-white/20" size={32} />
        <Star className="absolute top-[45%] left-[2%] animate-pulse text-yellow-200/40" size={24} />
        <Heart className="absolute bottom-10 left-10 text-white/10 fill-white hidden lg:block" size={120} />
      </div>

      {/* BOX ĐĂNG NHẬP */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto px-4 my-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden border-[10px] border-[#138713]">
          
          <div className="bg-[#1a472a] p-8 text-center relative">
            <Gift className="absolute top-4 left-4 text-red-400 rotate-12" size={32} />
            <Bell className="absolute top-4 right-4 text-yellow-400 -rotate-12" size={32} />
            
            <h1 className="text-3xl font-bold text-white uppercase tracking-normal leading-normal">
              ĐĂNG NHẬP
            </h1>
            <div className="h-1.5 w-16 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
            <p className="text-white/70 text-[10px] mt-2 font-bold uppercase tracking-widest">Keddy Pet Shop</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#D92020] tracking-wider ml-1">Email*</label>
              <input
                type="email"
                className={`w-full bg-slate-50 border-2 rounded-2xl h-12 px-4 focus:ring-4 focus:ring-red-50 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`}
                {...register("email")}
                disabled={isSubmitting}
                placeholder="ten@example.com"
              />
              {errors.email && <p className="text-[10px] text-red-600 font-bold ml-2 italic">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#D92020] tracking-wider ml-1">Mật Khẩu*</label>
              <input
                type="password"
                className={`w-full bg-slate-50 border-2 rounded-2xl h-12 px-4 focus:ring-4 focus:ring-red-50 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`}
                {...register("password")}
                disabled={isSubmitting}
                placeholder="••••••"
              />
              {errors.password && <p className="text-[10px] text-red-600 font-bold ml-2 italic">{errors.password.message}</p>}
            </div>

            {serverMsg && (
              <p className={`text-center text-xs font-bold ${serverMsg.includes('Chào mừng') ? 'text-green-600' : 'text-red-600'}`}>
                {serverMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full h-14 rounded-2xl bg-[#c41e3a] text-white font-bold text-lg shadow-lg hover:bg-[#a01830] transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <>Vào Cửa Hàng 🎅</>}
            </button>

            <div className="text-center pt-2">
              <Link href="/register" className="text-xs text-slate-500 font-medium hover:text-[#c41e3a]">
                Chưa có tài khoản? <span className="font-bold border-b border-slate-300">Đăng ký nhận quà</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}