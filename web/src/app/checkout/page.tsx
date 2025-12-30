"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/cart-context"; 
import { formatVND } from "@/lib/format";
import { apiFetch } from "@/lib/api"; 
import { 
  Truck, CreditCard, MapPin, Phone, User, 
  ArrowLeft, QrCode, Snowflake, Gift, Loader2 
} from "lucide-react";

// CẤU HÌNH NGÂN HÀNG
const MY_BANK = {
  BANK_ID: "mbbank",
  ACCOUNT_NO: "0327767221",
  ACCOUNT_NAME: "Nguyen Le Chi Khai",
};

type PM = "cod" | "banking";

// URL BACKEND TRÊN RENDER
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://keddy-api1.onrender.com";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal, hydrated, clearCart } = useCart(); 
  
  // States thông tin khách hàng
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState<PM>("cod");
  const [note, setNote] = useState("");
  
  // States trạng thái hệ thống
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // 1. TẠO MÃ NỘI DUNG VÀ TÍNH TOÁN (Dùng useMemo để không thay đổi khi render lại)
  const orderMemo = useMemo(() => `KEDDY${Math.floor(1000 + Math.random() * 9000)}`, []);
  const items = state.items;
  const totalAmount = subtotal;

  const qrUrl = useMemo(() => {
    const description = encodeURIComponent(orderMemo);
    return `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${totalAmount}&addInfo=${description}&accountName=${encodeURIComponent(MY_BANK.ACCOUNT_NAME)}`;
  }, [totalAmount, orderMemo]);

  // 2. HÀM LƯU ĐƠN HÀNG VÀO DATABASE (Gửi đến Render)
  const handleFinalSubmit = useCallback(async () => {
    if (submitting) return; // Chống bấm nhiều lần hoặc polling gọi trùng
    setSubmitting(true);
    setError(null);

    try {
      const userEmail = localStorage.getItem("userEmail") || "guest@shoply.local";
      
      // Sử dụng apiFetch để gửi dữ liệu đơn hàng
      const response = await apiFetch<{ success: boolean; data: any; message?: string }>("/orders", { 
        method: "POST",
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: addr,
          email: userEmail,
          paymentMethod: pm,
          paymentMemo: orderMemo,
          status: pm === "banking" ? "confirmed" : "pending",
          note: note || "",
          items: items.map((it: any) => ({
            productId: it.id || it.productId || it._id, 
            name: it.title || it.name,
            price: it.price,
            quantity: it.quantity,
            image: it.image
          })),
          subtotal: subtotal,
          total: totalAmount,
        }),
      });

      if (response.success) {
        setResult({ id: response.data?._id || orderMemo, customerName: name, total: totalAmount });
        clearCart();
      }
    } catch (err: any) {
      setError(err.message || "Không thể gửi đơn hàng đến máy chủ Noel.");
    } finally {
      setSubmitting(false);
    }
  }, [name, phone, addr, pm, orderMemo, items, subtotal, totalAmount, note, submitting, clearCart]);

  // 3. LOGIC QUÉT TIỀN TỰ ĐỘNG (POLLING)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isWaitingPayment && !paymentConfirmed) {
      interval = setInterval(async () => {
        try {
          // Gọi API check-banking trên server Render
          const checkRes = await fetch(`${BASE_URL}/api/v1/payments/check-banking?memo=${orderMemo}&amount=${totalAmount}`);
          const checkData = await checkRes.json();

          if (checkData.paid) {
            setPaymentConfirmed(true);
            setIsWaitingPayment(false);
            clearInterval(interval);
            // Tiền đã về -> Tự động lưu đơn
            handleFinalSubmit(); 
          }
        } catch (err) {
          console.error("Hệ thống đang quét giao dịch...");
        }
      }, 5000); // Quét mỗi 5 giây
    }

    return () => clearInterval(interval);
  }, [isWaitingPayment, paymentConfirmed, orderMemo, totalAmount, handleFinalSubmit]);

  // CHẶN RENDER KHI CHƯA HYDRATED (Tránh lỗi mismatch UI)
  if (!hydrated) return null;

  // XỬ LÝ KHI BẤM NÚT XÁC NHẬN
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return setError("Túi quà đang trống.");
    if (!name.trim() || !phone.trim() || !addr.trim()) return setError("Vui lòng nhập đủ thông tin.");

    if (pm === "banking" && !paymentConfirmed) {
      setIsWaitingPayment(true); // Hiển thị QR và bắt đầu Polling
      return;
    }

    handleFinalSubmit(); // Nếu là COD thì lưu luôn
  }

  // MÀN HÌNH THÀNH CÔNG
  if (result) {
    return (
      <main className="container mx-auto px-4 py-20 text-center max-w-2xl">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border-t-8 border-red-600 relative overflow-hidden">
          <Snowflake className="absolute top-4 left-4 text-blue-100 animate-spin-slow" size={40} />
          <Gift size={60} className="mx-auto mb-6 text-green-600 animate-bounce" />
          <h2 className="text-3xl font-bold text-red-600 mb-2 uppercase italic">Đặt hàng thành công!</h2>
          <p className="text-slate-500 mb-8 italic">Cảm ơn <b>{result.customerName}</b>, quà Noel đã được tiếp nhận. 🎄</p>
          <div className="bg-slate-50 p-6 rounded-2xl text-left border border-red-100 space-y-2 mb-8">
            <p className="flex justify-between text-sm"><span>Mã đơn hàng:</span> <b className="font-mono text-red-600">{result.id}</b></p>
            <p className="flex justify-between text-sm"><span>Số tiền:</span> <b className="text-red-600">{formatVND(result.total)}</b></p>
          </div>
          <button onClick={() => router.push("/shop")} className="w-full py-4 bg-green-700 text-white font-bold rounded-2xl uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">
            Tiếp tục mua quà 🎁
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] py-10 text-slate-900 relative">
      {/* Hiệu ứng tuyết nền */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <Snowflake key={i} className="absolute text-blue-300 animate-pulse" style={{ left: `${i * 20}%`, top: `${Math.random() * 100}%`, animationDelay: `${i}s` }} />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold mb-8 uppercase text-xs transition-colors">
          <ArrowLeft size={18} /> Quay lại túi quà
        </button>

        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: THÔNG TIN */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-[35px] shadow-xl border-2 border-red-50">
              <h2 className="text-xl font-bold mb-6 text-red-600 flex items-center gap-3 italic uppercase">
                <Gift size={22} /> 1. Thông tin giao quà
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-red-200" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-red-50/20 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" 
                    value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên người nhận *" required />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-red-200" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-red-50/20 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" 
                    value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại *" required />
                </div>
                <div className="relative col-span-2">
                  <MapPin className="absolute left-4 top-6 text-red-200" size={18} />
                  <textarea className="w-full pl-12 pr-4 py-4 bg-red-50/20 border-none rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all min-h-[100px]" 
                    value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Địa chỉ giao hàng *" required />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-[35px] shadow-xl border-2 border-red-50">
              <h2 className="text-xl font-bold mb-6 text-green-700 flex items-center gap-3 italic uppercase">
                <CreditCard size={22} /> 2. Hình thức thanh toán
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {(["cod", "banking"] as const).map((opt) => (
                  <label key={opt} className={`flex flex-col items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${pm === opt ? "border-red-600 bg-red-50 text-red-600 shadow-md" : "border-slate-50 bg-slate-50 text-slate-400 hover:bg-red-50/30"}`}>
                    <input type="radio" className="hidden" name="pm" checked={pm === opt} onChange={() => { setPM(opt); setIsWaitingPayment(false); }} />
                    <div className="mb-2">{opt === "cod" ? <Truck size={24} /> : <QrCode size={24} />}</div>
                    <span className="text-[10px] font-bold uppercase">{opt === "cod" ? "Tiền mặt (COD)" : "Chuyển khoản"}</span>
                  </label>
                ))}
              </div>

              {pm === "banking" && (
                <div className="bg-red-50/50 p-6 rounded-[30px] border-2 border-dashed border-red-200 text-center animate-in fade-in zoom-in duration-300">
                  <div className="relative inline-block bg-white p-3 rounded-2xl shadow-md mb-4 border border-red-100">
                    <img src={qrUrl} alt="VietQR" className={`w-48 h-48 transition-opacity ${isWaitingPayment ? 'opacity-40' : 'opacity-100'}`} />
                    {isWaitingPayment && <Loader2 className="absolute inset-0 m-auto animate-spin text-red-600" size={40} />}
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-red-200 inline-block w-full max-w-xs">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nội dung bắt buộc:</p>
                    <p className="text-2xl font-black text-red-600 tracking-widest">{orderMemo}</p>
                  </div>
                  {isWaitingPayment && (
                    <p className="mt-4 text-xs font-bold text-blue-600 animate-pulse flex items-center justify-center gap-2">
                      <Snowflake size={14} className="animate-spin-slow" /> Đang đợi hệ thống Render xác nhận tiền...
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT */}
          <aside className="lg:col-span-1">
            <div className="bg-[#C41E3A] text-white p-8 rounded-[40px] shadow-2xl sticky top-6 border-4 border-white/10">
              <h2 className="text-lg font-black mb-6 uppercase italic text-center border-b border-white/20 pb-4 flex items-center justify-center gap-2">
                <Gift size={20} /> Túi Quà Noel
              </h2>
              
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8 space-y-4">
                {items.map((it: any) => (
                  <div key={it.id || it.productId} className="flex gap-4 items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0">
                      <img src={it.image || "/placeholder.svg"} className="w-full h-full object-cover" alt={it.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold truncate uppercase">{it.title || it.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[9px] text-white/60 font-medium">SL: {it.quantity}</p>
                        <p className="text-sm font-black text-yellow-300">{formatVND(it.price * it.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-white/20 pt-6">
                <span className="text-[10px] font-bold uppercase text-white/60 italic">Tổng thanh toán</span>
                <span className="text-3xl font-black text-yellow-300 drop-shadow-lg">{formatVND(totalAmount)}</span>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-5 bg-green-700 hover:bg-green-600 text-white font-bold rounded-[20px] mt-10 transition-all active:scale-95 shadow-xl uppercase tracking-widest disabled:opacity-50">
                {submitting ? <Loader2 className="animate-spin mx-auto" /> : isWaitingPayment ? "Đang quét mã..." : "Xác nhận đơn hàng 🎅"}
              </button>
              
              {error && <p className="mt-4 text-[10px] bg-white text-red-600 p-3 rounded-xl font-bold text-center animate-shake">{error}</p>}
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}