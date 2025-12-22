"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/cart-context"; 
import { formatVND } from "@/lib/format";
import { 
  ShieldCheck, Truck, CreditCard, 
  MapPin, Phone, User, FileText, 
  ChevronRight, ArrowLeft, QrCode, Snowflake, Gift 
} from "lucide-react";

const MY_BANK = {
  BANK_ID: "mbbank",
  ACCOUNT_NO: "0327767221",
  ACCOUNT_NAME: "Nguyen Le Chi Khai",
};

type PM = "cod" | "banking" | "momo";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal, hydrated, clearCart } = useCart(); 
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState<PM>("cod");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!hydrated) return null;

  const items = state.items;
  const shippingFee = items.length > 0 ? 0 : 0; 
  const totalAmount = subtotal + shippingFee;

  const qrUrl = useMemo(() => {
    const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const description = encodeURIComponent(`Keddy Pet ${cleanName || "Thanh toan"}`);
    return `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${totalAmount}&addInfo=${description}&accountName=${encodeURIComponent(MY_BANK.ACCOUNT_NAME)}`;
  }, [totalAmount, name]);

async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  
  if (items.length === 0) {
    setError("Giỏ hàng của bạn đang trống.");
    return;
  }
  if (!name || !addr || !phone) {
    setError("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ.");
    return;
  }
  setSubmitting(true);
  
  try {
    const response = await fetch("http://localhost:4000/api/v1/orders", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,    // Khớp với customerPhone trong Zod
        customerAddress: addr,  // Khớp với customerAddress trong Zod
        paymentMethod: pm,      // Đảm bảo là "cod", "banking" hoặc "momo"
        note: note || "",       // Tránh gửi undefined
        items: items.map((it: any) => ({
          productId: String(it.productId), // Ép kiểu chuỗi cho Zod
          quantity: Number(it.quantity),   // Ép kiểu số cho Zod
        })),
      }),
    });

    const data = await response.json();

    if (data.ok) {
      setResult({
        id: data.order.orderCode, 
        customerName: name,
        total: totalAmount
      });
      clearCart(); 
    } else {
      // Nếu Zod báo lỗi, thông báo sẽ nằm ở đây
      throw new Error(data.error?.message || "Dữ liệu không hợp lệ theo chuẩn Noel.");
    }
  } catch (err: any) {
    setError(err.message || "Không thể kết nối tới server.");
  } finally {
    setSubmitting(false);
  }
}

  if (result) {
    return (
      <main className="container mx-auto px-4 py-20 text-center max-w-2xl">
        <div className="bg-white p-10 rounded-[40px] shadow-xl border-t-8 border-red-600 text-slate-900 relative overflow-hidden">
          <Snowflake className="absolute top-4 left-4 text-blue-100 animate-spin-slow" size={40} />
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift size={48} className="animate-bounce" />
          </div>
          <h2 className="text-3xl font-black mb-2 uppercase italic text-red-600">Đặt hàng thành công!</h2>
          <p className="text-slate-500 mb-8">Cảm ơn <b>{result.customerName}</b>, Keddy Pet đã tiếp nhận đơn hàng Noel của bạn. 🎄</p>
          <div className="bg-slate-50 p-6 rounded-2xl text-left mb-8 space-y-2 border border-red-100">
            <p className="flex justify-between text-sm"><span>Mã đơn hàng:</span> <b className="font-mono text-red-600">{result.id}</b></p>
            <p className="flex justify-between text-sm"><span>Tổng thanh toán:</span> <b className="text-[#c41e3a] font-black">{formatVND(result.total)}</b></p>
          </div>
          <button onClick={() => router.push("/shop")} className="w-full py-4 bg-green-700 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">
            Tiếp tục mua quà 🎁
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] py-10 text-slate-900 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <Snowflake key={i} className="absolute text-blue-200 animate-pulse" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDuration: `${Math.random()*3+2}s` }} />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-8 transition-all group uppercase text-xs">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Quay lại giỏ quà
        </button>

        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-[35px] shadow-xl border-2 border-red-50">
              <h2 className="text-xl font-black mb-6 uppercase italic flex items-center gap-3 text-red-600">
                <Gift className="text-red-600" /> 1. Thông tin giao quà Noel
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative col-span-2 md:col-span-1">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-red-200" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-red-50/30 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-slate-900" 
                    value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên người nhận *" />
                </div>
                <div className="relative col-span-2 md:col-span-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-red-200" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-red-50/30 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-slate-900" 
                    value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại nhận quà *" />
                </div>
                <div className="relative col-span-2">
                  <MapPin className="absolute left-4 top-6 text-red-200" size={18} />
                  <textarea className="w-full pl-12 pr-4 py-4 bg-red-50/30 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all min-h-[100px] text-slate-900" 
                    value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Địa chỉ giao hàng (Số nhà, tên đường...) *" />
                </div>
                <div className="relative col-span-2">
                  <FileText className="absolute left-4 top-4 text-red-200" size={18} />
                  <textarea className="w-full pl-12 pr-4 py-4 bg-red-50/30 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-slate-900" 
                    value={note} onChange={(e) => setNote(e.target.value)} placeholder="Lời nhắn gửi tới Keddy Pet" />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-[35px] shadow-xl border-2 border-red-50">
              <h2 className="text-xl font-black mb-6 uppercase italic flex items-center gap-3 text-green-700">
                <CreditCard className="text-green-700" /> 2. Hình thức thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                {(["cod", "banking", "momo"] as const).map((opt) => (
                  <label key={opt} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${pm === opt ? "border-red-600 bg-red-50 text-red-600" : "border-slate-50 bg-slate-50 text-slate-400 hover:bg-red-50/50"}`}>
                    <input type="radio" className="hidden" name="pm" value={opt} checked={pm === opt} onChange={() => setPM(opt)} />
                    <div className="mb-2">
                      {opt === "cod" && <Truck size={20} />}
                      {opt === "banking" && <QrCode size={20} />}
                      {opt === "momo" && <span className="font-bold text-[10px]">MoMo</span>}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tighter">
                      {opt === "cod" ? "Tiền mặt (COD)" : opt === "banking" ? "Chuyển khoản" : "Ví MoMo"}
                    </span>
                  </label>
                ))}
              </div>

              {pm === "banking" && (
                <div className="bg-red-50/50 p-6 rounded-[30px] border-2 border-dashed border-red-200 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-red-100">
                      <img src={qrUrl} alt="Mã QR Noel" className="w-44 h-44 object-contain" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <div className="flex items-center gap-2 justify-center md:justify-start text-red-700 font-black uppercase text-[10px] tracking-[0.2em]">
                        <Snowflake size={16} className="text-blue-300 animate-spin-slow" /> Quét mã thanh toán Noel
                      </div>
                      <p className="text-[12px] text-slate-500 leading-relaxed italic">
                        Mã QR đã bao gồm <b>{formatVND(totalAmount)}</b>. Keddy sẽ chuẩn bị quà ngay khi nhận được thông báo! 🎁
                      </p>
                      <div className="pt-2 border-t border-red-100 space-y-1">
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Ngân hàng: <span className="text-red-700 font-black">{MY_BANK.BANK_ID}</span></p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">STK: <span className="text-red-700 font-black">{MY_BANK.ACCOUNT_NO}</span></p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Chủ TK: <span className="text-red-700 font-black">{MY_BANK.ACCOUNT_NAME}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            {error && <div className="p-4 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg animate-shake">{error}</div>}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-[#C41E3A] text-white p-8 rounded-[40px] shadow-2xl sticky top-6 border-4 border-white/20">
              <h2 className="text-lg font-black mb-6 uppercase tracking-widest border-b border-white/20 pb-4 italic flex items-center gap-2">
                 <Gift size={20} /> Túi Quà Noel
              </h2>
              <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar mb-6 space-y-5">
                {items.map((it: any) => (
                  <div key={it.id || it.productId} className="flex gap-4 items-center group">
                    <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 border-2 border-red-400">
                      <img src={it.image || "/placeholder.svg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={it.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate uppercase text-white">{it.title}</p>
                      <div className="flex justify-between items-center mt-1">
                          <p className="text-[10px] text-white/70 italic">SL: {it.quantity}</p>
                          <p className="text-sm font-black text-yellow-300">{formatVND(it.price * it.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 border-t border-white/20 pt-6">
                <div className="flex justify-between text-xs text-white/80">
                  <span className="font-medium">Giá trị quà</span>
                  <span className="font-bold">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-white/80">
                  <span className="font-medium">Phí chuyển trượt tuyết</span>
                  <span className="text-yellow-300 font-bold uppercase text-[9px] tracking-widest">
                    {shippingFee === 0 ? "Miễn phí Noel" : formatVND(shippingFee)}
                  </span>
                </div>
                <div className="pt-4 mt-2 border-t border-white/40 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/60">Tổng cộng</span>
                  <span className="text-3xl font-black text-yellow-300 leading-none drop-shadow-lg">
                    {formatVND(totalAmount)}
                  </span>
                </div>
              </div>
              <button 
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full py-5 bg-green-700 hover:bg-green-600 text-white font-black rounded-[20px] mt-10 transition-all active:scale-95 shadow-xl uppercase tracking-[0.1em] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? "Đang chuẩn bị quà..." : <>Xác nhận đơn hàng 🎅</>}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}