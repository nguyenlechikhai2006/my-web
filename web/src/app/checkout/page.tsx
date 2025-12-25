"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/cart-context"; 
import { formatVND } from "@/lib/format";
import { 
  ShieldCheck, Truck, CreditCard, 
  MapPin, Phone, User, FileText, 
  ChevronRight, ArrowLeft, QrCode, Snowflake, Gift,
  Loader2 
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
  
  // 1. KHAI BÁO TẤT CẢ STATE TRÊN CÙNG
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState<PM>("cod");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [isWaitingPayment, setIsWaitingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // 2. KHAI BÁO CÁC HOOKS TÍNH TOÁN
  const orderMemo = useMemo(() => {
    return `KEDDY${Math.floor(1000 + Math.random() * 9000)}`;
  }, []);

  const items = state.items;
  const shippingFee = items.length > 0 ? 0 : 0; 
  const totalAmount = subtotal + shippingFee;

  const qrUrl = useMemo(() => {
    const description = encodeURIComponent(orderMemo);
    return `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${totalAmount}&addInfo=${description}&accountName=${encodeURIComponent(MY_BANK.ACCOUNT_NAME)}`;
  }, [totalAmount, orderMemo]);

  // 3. LOGIC LƯU ĐƠN HÀNG (TÁCH RIÊNG ĐỂ DÙNG CHUNG)
  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const userEmail = localStorage.getItem("userEmail");
      const response = await fetch("http://localhost:4000/api/v1/orders", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: addr,
          email: userEmail,
          paymentMethod: pm,
          paymentMemo: orderMemo,
          status: pm === "banking" ? "paid" : "pending",
          note: note || "",
          items: items.map((it: any) => ({
            id: it.id || it.productId,
            title: it.title,
            price: it.price,
            quantity: it.quantity,
            image: it.image
          })),
          subtotal: subtotal,
          shippingFee: shippingFee,
          total: totalAmount,
        }),
      });

      const data = await response.json();
      if (data.ok || response.ok) {
        setResult({
          id: data.data?._id || "NOEL-" + Math.floor(Math.random() * 10000), 
          customerName: name,
          total: totalAmount
        });
        clearCart();
      }
    } catch (err: any) {
      setError("Máy chủ không phản hồi, vui lòng liên hệ hotline.");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. LOGIC QUÉT THANH TOÁN (EFFECT)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isWaitingPayment && !paymentConfirmed) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:4000/api/v1/payments/check-banking?memo=${orderMemo}&amount=${totalAmount}`);
          const data = await res.json();
          
          if (data.paid) {
            setPaymentConfirmed(true);
            setIsWaitingPayment(false);
            clearInterval(interval);
            handleFinalSubmit();
          }
        } catch (err) {
          console.error("Lỗi polling thanh toán:", err);
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isWaitingPayment, paymentConfirmed, orderMemo, totalAmount]);

  // 5. KIỂM TRA HYDRATED (CHỈ ĐẶT SAU KHI ĐÃ GỌI HẾT HOOKS)
  if (!hydrated) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (items.length === 0) return setError("Túi quà của bạn đang trống.");
    if (!name.trim() || !addr.trim() || !phone.trim()) return setError("Vui lòng điền đủ thông tin giao quà.");

    if (pm === "banking" && !paymentConfirmed) {
      setIsWaitingPayment(true);
      return;
    }

    handleFinalSubmit();
  }

  // GIAO DIỆN THÀNH CÔNG
  if (result) {
    return (
      <main className="container mx-auto px-4 py-20 text-center max-w-2xl">
        <div className="bg-white p-10 rounded-[40px] shadow-xl border-t-8 border-red-600 text-slate-900 relative overflow-hidden">
          <Snowflake className="absolute top-4 left-4 text-blue-100 animate-spin-slow" size={40} />
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift size={48} className="animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold mb-2 uppercase italic text-red-600">Đặt hàng thành công!</h2>
          <p className="text-slate-500 mb-8">Cảm ơn <b>{result.customerName}</b>, Keddy Pet đã tiếp nhận đơn hàng Noel của bạn. 🎄</p>
          <div className="bg-slate-50 p-6 rounded-2xl text-left mb-8 space-y-2 border border-red-100">
            <p className="flex justify-between text-sm"><span>Mã đơn hàng:</span> <b className="font-mono text-red-600">{result.id}</b></p>
            <p className="flex justify-between text-sm"><span>Tổng thanh toán:</span> <b className="text-[#c41e3a] font-bold">{formatVND(result.total)}</b></p>
          </div>
          <button onClick={() => router.push("/shop")} className="w-full py-4 bg-green-700 text-white font-bold rounded-2xl uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">
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
              <h2 className="text-xl font-bold mb-6 uppercase italic flex items-center gap-3 text-red-600">
                <Gift className="text-red-600" /> 1. Thông tin giao quà Noel
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative col-span-2 md:col-span-1">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-red-200" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-red-50/30 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-slate-900" 
                    value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên người nhận *" required />
                </div>
                <div className="relative col-span-2 md:col-span-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-red-200" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-red-50/30 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-slate-900" 
                    value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại nhận quà *" required />
                </div>
                <div className="relative col-span-2">
                  <MapPin className="absolute left-4 top-6 text-red-200" size={18} />
                  <textarea className="w-full pl-12 pr-4 py-4 bg-red-50/30 border-none rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all min-h-[100px] text-slate-900" 
                    value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Địa chỉ giao hàng (Số nhà, tên đường...) *" required />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-[35px] shadow-xl border-2 border-red-50">
              <h2 className="text-xl font-bold mb-6 uppercase italic flex items-center gap-3 text-green-700">
                <CreditCard className="text-green-700" /> 2. Hình thức thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                {(["cod", "banking", "momo"] as const).map((opt) => (
                  <label key={opt} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${pm === opt ? "border-red-600 bg-red-50 text-red-600" : "border-slate-50 bg-slate-50 text-slate-400 hover:bg-red-50/50"}`}>
                    <input type="radio" className="hidden" name="pm" value={opt} checked={pm === opt} onChange={() => { setPM(opt); setIsWaitingPayment(false); }} />
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
                    <div className="relative group bg-white p-3 rounded-2xl shadow-md border-2 border-red-100">
                      <img src={qrUrl} alt="Mã QR Noel" className={`w-44 h-44 object-contain transition-opacity ${isWaitingPayment ? 'opacity-40' : 'opacity-100'}`} />
                      {isWaitingPayment && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="animate-spin text-red-600" size={40} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <div className="flex items-center gap-2 justify-center md:justify-start text-red-700 font-black uppercase text-[10px] tracking-[0.2em]">
                        <Snowflake size={16} className="text-blue-300 animate-spin-slow" /> Quét mã thanh toán Noel
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-red-200 inline-block md:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Nội dung chuyển khoản bắt buộc:</p>
                        <p className="text-xl font-black text-red-600 tracking-widest">{orderMemo}</p>
                      </div>
                      {isWaitingPayment && (
                        <div className="py-2 px-4 bg-blue-600 text-white rounded-lg text-xs font-bold animate-pulse inline-flex items-center gap-2">
                          <Loader2 size={12} className="animate-spin" /> Hệ thống đang kiểm tra tiền về...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-[#C41E3A] text-white p-8 rounded-[40px] shadow-2xl sticky top-6 border-4 border-white/20">
              <h2 className="text-lg font-black mb-6 uppercase tracking-widest border-b border-white/20 pb-4 italic flex items-center gap-2 text-white">
                 <Gift size={20} /> Túi Quà Noel
              </h2>
              <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar mb-6 space-y-5">
                {items.map((it: any) => (
                  <div key={it.id || it.productId} className="flex gap-4 items-center group">
                    <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 border-2 border-red-400">
                      <img src={it.image || "/placeholder.svg"} className="w-full h-full object-cover" alt={it.title} />
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
                <div className="pt-4 mt-2 border-t border-white/40 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-white/60">Tổng cộng</span>
                  <span className="text-3xl font-black text-yellow-300 leading-none drop-shadow-lg">
                    {formatVND(totalAmount)}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-green-700 hover:bg-green-600 text-white font-bold rounded-[20px] mt-10 transition-all active:scale-95 shadow-xl uppercase tracking-[0.1em] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : isWaitingPayment ? (
                  "Đang chờ bạn quét mã..."
                ) : (
                  <>Xác nhận đơn hàng 🎅</>
                )}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}