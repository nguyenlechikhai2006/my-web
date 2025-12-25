"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas";
import { useState } from "react";
import { Snowflake, Gift, Bell, Star, Heart, User, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<RegisterValues>({ 
    resolver: zodResolver(registerSchema), 
    mode: "onChange" 
  });

  async function onSubmit(values: RegisterValues) {
    setServerMsg(null);
    try {
      // CẬP NHẬT: Trỏ đúng đến cổng 5000 và tiền tố v1 của Backend
      const res = await fetch("https://keddyy-api.onrender.com/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password // Sẽ được controller mã hóa thành passwordHash
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setServerMsg(data?.message ?? "Đăng ký thất bại");
        return;
      }

      // TỰ ĐỘNG ĐĂNG NHẬP SAU KHI ĐĂNG KÝ THÀNH CÔNG
      // Chỉnh sửa: data.data là cấu trúc trả về từ controller của bạn
      const newUser = data.data; 
      if (newUser && newUser.name) {
        // 1. Lưu tên người dùng mới vào máy
        localStorage.setItem("userName", newUser.name);
        
        // 2. Phát tín hiệu để SiteHeader hiển thị tên ngay
        window.dispatchEvent(new Event("userLogin")); 
        
        setServerMsg(`Chúc mừng ${newUser.name}! Bạn đã nhận được thẻ thành viên Giáng Sinh! 🎄`);

        // 3. Chuyển hướng về trang chủ sau khi người dùng kịp đọc thông báo
        setTimeout(() => {
          window.location.href = "/"; // Dùng window.location để cưỡng bức reload trang chủ
        }, 1500);
      }
    } catch (error) {
      setServerMsg("Lõi kết nối đến Server Noel (Cổng 4000)");
    }
  }

  const pwd = watch("password");

  return (
    /* Phủ đầy không gian bên dưới Header (giả định Header cao 140px) */
    <main className="relative w-full min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#4794EC] overflow-hidden">
      
      {/* Hiệu ứng trang trí tràn viền 2 bên */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/snow.png')` }}></div>
        
        <Snowflake className="absolute top-[10%] left-[5%] animate-bounce text-white/40" size={48} />
        <Snowflake className="absolute top-[20%] right-[8%] animate-pulse text-white/30" size={64} />
        <Star className="absolute bottom-[20%] left-[10%] animate-spin-slow text-yellow-200/40" size={32} />
        <Gift className="absolute bottom-[10%] right-[5%] text-white/20 -rotate-12" size={80} />
      </div>

      {/* Box Đăng ký phong cách Hộp quà Noel */}
      <div className="relative z-10 w-full max-w-[480px] mx-4 my-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[40px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden border-[10px] border-[#138713]">
          
          {/* Header Xanh Thông */}
          <div className="bg-[#1a472a] p-6 text-center relative">
            <Gift className="absolute top-4 left-4 text-red-400 rotate-12" size={32} />
            <Bell className="absolute top-4 right-4 text-yellow-400 -rotate-12" size={32} />
            
            <h1 className="text-3xl font-bold text-white uppercase tracking-normal leading-normal">
              Đăng Ký <span className="text-red-400"></span>
            </h1>
            <p className="text-white/70 text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">Nhận ngay ưu đãi Noel 2025</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
            {/* Họ tên */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-[#000000] ml-1">
                <User size={14} /> Họ và tên
              </label>
              <input
                className={`w-full bg-slate-50 border-2 rounded-2xl h-11 px-4 outline-none transition-all focus:ring-4 focus:ring-red-50 ${errors.name ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`}
                {...register("name")}
                disabled={isSubmitting}
                placeholder="Nguyễn Văn A"
              />
              {errors.name && <p className="text-[10px] text-red-600 font-bold ml-2">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-[#D92020] ml-1">
                <Mail size={14} /> Email*
              </label>
              <input
                type="email"
                className={`w-full bg-slate-50 border-2 rounded-2xl h-11 px-4 outline-none transition-all focus:ring-4 focus:ring-red-50 ${errors.email ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`}
                {...register("email")}
                disabled={isSubmitting}
                placeholder="ban@example.com"
              />
              {errors.email && <p className="text-[10px] text-red-600 font-bold ml-2">{errors.email.message}</p>}
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-[#D92020] ml-1">
                <Lock size={14} /> Mật khẩu*
              </label>
              <input
                type="password"
                className={`w-full bg-slate-50 border-2 rounded-2xl h-11 px-4 outline-none transition-all focus:ring-4 focus:ring-red-50 ${errors.password ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`}
                {...register("password")}
                disabled={isSubmitting}
                placeholder="••••••"
              />
              {errors.password && <p className="text-[10px] text-red-600 font-bold ml-2">{errors.password.message}</p>}
            </div>

            {/* Nhập lại mật khẩu */}
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-[#000000] ml-1">
                <Lock size={14} /> Nhập lại mật khẩu
              </label>
              <input
                type="password"
                className={`w-full bg-slate-50 border-2 rounded-2xl h-11 px-4 outline-none transition-all focus:ring-4 focus:ring-red-50 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`}
                {...register("confirmPassword")}
                disabled={isSubmitting}
                placeholder="••••••"
              />
              {errors.confirmPassword && <p className="text-[10px] text-red-600 font-bold ml-2">{errors.confirmPassword.message}</p>}
            </div>

            {/* Nút Đăng ký */}
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full h-14 rounded-2xl bg-[#c41e3a] text-white font-bold text-lg shadow-lg hover:bg-[#a01830] transition-all flex items-center justify-center gap-3 mt-4 active:scale-95"
            >
              {isSubmitting ? <Snowflake className="animate-spin" /> : <>Đăng Ký 🎅</>}
            </button>

            {serverMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold text-center border ${serverMsg.includes("thành công") ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                {serverMsg}
              </div>
            )}

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 font-medium">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-[#c41e3a] font-bold hover:underline ml-1">
                  Đăng nhập tại đây
                </Link>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-slate-50 py-4 text-center border-t border-slate-100">
            <span className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black">
              Keddy Pet Shop • Merry Christmas
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}