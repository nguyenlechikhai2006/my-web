"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas";
import { useState } from "react";
import { Snowflake, Gift, Bell, Star, User, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
// ĐẢM BẢO ĐƯỜNG DẪN NÀY ĐÚNG: Nếu bạn đặt file apiFetch trong thư mục lib
import { apiFetch } from "@/lib/api"; 

export default function RegisterPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterValues>({ 
    resolver: zodResolver(registerSchema), 
    mode: "onChange" 
  });

  async function onSubmit(values: RegisterValues) {
    setServerMsg(null);
    try {
      // Gọi API thông qua hàm apiFetch đã tối ưu ở Bước 1
      const response = await apiFetch<{ ok: boolean; data: any; message?: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password, 
        }),
      });

      if (response.ok) {
        const newUser = response.data; 
        
        // Lưu thông tin vào LocalStorage để đồng bộ toàn trang web
        localStorage.setItem("userName", newUser.name);
        localStorage.setItem("userEmail", newUser.email);
        localStorage.setItem("userRole", newUser.role || "user");
        
        // Phát sự kiện cập nhật Header ngay lập tức mà không cần F5
        window.dispatchEvent(new Event("userLogin")); 
        
        setServerMsg(`Chúc mừng ${newUser.name}! Bạn đã nhận được thẻ thành viên Giáng Sinh! 🎄`);

        // Chuyển hướng sau khi hiện thông báo thành công
        setTimeout(() => {
          window.location.href = "/"; 
        }, 1500);
      }
    } catch (error: any) {
      // Hiển thị lỗi từ Backend (Ví dụ: Email đã tồn tại)
      setServerMsg(error.message || "Lỗi kết nối đến Server Noel");
    }
  }

  return (
    <main className="relative w-full min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#4794EC] overflow-hidden py-10">
      {/* Background Noel */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/snow.png')` }}></div>
        <Snowflake className="absolute top-[10%] left-[5%] animate-bounce text-white/40" size={48} />
        <Snowflake className="absolute top-[20%] right-[8%] animate-pulse text-white/30" size={64} />
        <Star className="absolute bottom-[20%] left-[10%] animate-spin-slow text-yellow-200/40" size={32} />
        <Gift className="absolute bottom-[10%] right-[5%] text-white/20 -rotate-12" size={80} />
      </div>

      <div className="relative z-10 w-full max-w-[480px] mx-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[40px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden border-[10px] border-[#138713]">
          <div className="bg-[#1a472a] p-6 text-center relative">
            <h1 className="text-3xl font-bold text-white uppercase italic">Đăng Ký 🎅</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 ml-1"><User size={14} /> Họ và tên</label>
              <input className={`w-full bg-slate-50 border-2 rounded-2xl h-11 px-4 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`} {...register("name")} placeholder="Nguyễn Văn A" />
              {errors.name && <p className="text-[10px] text-red-600 font-bold ml-2">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-[#D92020] ml-1"><Mail size={14} /> Email*</label>
              <input type="email" className={`w-full bg-slate-50 border-2 rounded-2xl h-11 px-4 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`} {...register("email")} placeholder="ban@example.com" />
              {errors.email && <p className="text-[10px] text-red-600 font-bold ml-2">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-[#D92020] ml-1"><Lock size={14} /> Mật khẩu*</label>
              <input type="password" className={`w-full bg-slate-50 border-2 rounded-2xl h-11 px-4 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`} {...register("password")} placeholder="••••••" />
              {errors.password && <p className="text-[10px] text-red-600 font-bold ml-2">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 ml-1"><Lock size={14} /> Nhập lại mật khẩu</label>
              <input type="password" className={`w-full bg-slate-50 border-2 rounded-2xl h-11 px-4 outline-none transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-slate-100 focus:border-[#c41e3a]'}`} {...register("confirmPassword")} placeholder="••••••" />
              {errors.confirmPassword && <p className="text-[10px] text-red-600 font-bold ml-2">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting || !isValid} className="w-full h-14 rounded-2xl bg-[#c41e3a] text-white font-bold text-lg shadow-lg hover:bg-[#a01830] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <>Đăng Ký 🎁</>}
            </button>

            {serverMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold text-center border ${serverMsg.includes("Chúc mừng") ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                {serverMsg}
              </div>
            )}
          </form>
          <div className="bg-slate-50 py-4 text-center border-t border-slate-100 text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
            Keddy Pet Shop • Merry Christmas
          </div>
        </div>
      </div>
    </main>
  );
}