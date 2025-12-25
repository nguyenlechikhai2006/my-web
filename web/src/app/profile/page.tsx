"use client";
import { useEffect, useState } from "react";
import { User, Calendar, MapPin, Snowflake, Gift, X, Package } from "lucide-react";
import { formatVND } from "@/lib/format";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State để quản lý việc xem chi tiết đơn hàng
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedName && storedEmail) {
      setUser({ name: storedName, email: storedEmail });
      fetchOrders(storedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/orders/user/${email}`);
      const data = await res.json();
      if (data.success || data.ok) setOrders(data.data);
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fbff] pb-20 relative">
      {/* Banner phong cách Noel */}
      <div className="bg-[#4794EC] pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/snow.png')" }}></div>
        <div className="max-w-5xl mx-auto flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-red-500 flex items-center justify-center text-4xl shadow-2xl animate-bounce">
            🎅
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold italic uppercase tracking-tighter">Nhà của {user?.name}</h1>
            <p className="text-white/70 font-medium">Thành viên của Keddy Pet 🎄</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Thông tin cá nhân */}
          <div className="bg-white rounded-[40px] p-8 shadow-2xl border-b-8 border-[#138713]">
            <h3 className="text-lg font-bold text-[#000000] mb-6 flex items-center gap-2 uppercase italic">
              <User size={20} className="text-red-500" /> Hồ sơ cá nhân
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-slate-400">Email nhận quà</p>
                <p className="text-slate-800 font-medium">{user?.email}</p>
              </div>
              <button 
                onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs uppercase"
              >
                Đăng xuất khỏi cửa hàng🦌
              </button>
            </div>
          </div>

          {/* Lịch sử đơn hàng */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-[#000000] flex items-center gap-2 uppercase italic drop-shadow-sm">
              <Gift size={24} className="text-red-600" /> Lịch sử đặt hàng ({orders.length})
            </h3>

            {loading ? (
              <div className="bg-white p-12 rounded-[40px] text-center shadow-xl border-2 border-dashed border-red-200">
                <Snowflake className="mx-auto mb-4 text-blue-300 animate-spin" size={40} />
                <p className="font-bold text-slate-400 italic">Đang kiểm tra túi quà của bạn...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="grid gap-4">
                {orders.map((order: any) => (
                  <div key={order._id} className="bg-white rounded-[30px] p-6 shadow-md border-2 border-transparent hover:border-red-500 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">
                             Mã: {order._id.slice(-6).toUpperCase()}
                           </span>
                           <span className="text-[10px] font-bold text-orange-500 italic">● {order.status === 'pending' ? 'Chờ xử lý' : 'Đang vận chuyển'}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                          <Calendar size={12} /> Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-sm font-bold text-slate-700 mt-2 flex items-center gap-1">
                          <MapPin size={14} className="text-red-400" /> {order.customerAddress}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-red-600">
                          {formatVND(order.total || 0)}
                        </p>
                        {/* NÚT XEM CHI TIẾT */}
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="mt-4 px-4 py-2 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase hover:bg-slate-900 transition-all shadow-md active:scale-95"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[40px] text-center shadow-xl border-2 border-red-50">
                <Gift className="mx-auto mb-4 text-slate-200" size={60} />
                <p className="text-slate-400 font-bold italic mb-6">Túi quà đang trống trơn!</p>
                <button onClick={() => window.location.href = "/shop"} className="px-8 py-3 bg-[#138713] text-white font-bold rounded-2xl uppercase text-xs">Đi mua quà ngay 🎁</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-[#138713] relative animate-in zoom-in duration-300">
            {/* Header Modal */}
            <div className="bg-[#1a472a] p-6 text-white text-center relative">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 bg-red-600 rounded-full hover:rotate-90 transition-transform"
              >
                <X size={16} />
              </button>
              <h3 className="text-xl font-bold uppercase italic">Chi tiết túi quà</h3>
              <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mt-1">Mã: #{selectedOrder._id.slice(-6).toUpperCase()}</p>
            </div>

            {/* Danh sách sản phẩm trong đơn */}
            <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {selectedOrder.items && selectedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-16 h-16 bg-white rounded-xl border border-red-100 overflow-hidden flex-shrink-0">
                      <img src={item.image || "/anh/placeholder.png"} className="w-full h-full object-cover" alt={item.title} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase text-slate-800 line-clamp-1">{item.title || "Sản phẩm Noel"}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">SL: {item.quantity}</p>
                        <p className="text-sm font-bold text-red-600">{formatVND(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Modal: Tổng cộng */}
            <div className="p-6 bg-slate-50 border-t-2 border-dashed border-slate-200">
              <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-500">
                <span>Trạng thái:</span>
                <span className="text-orange-500 uppercase italic">● Đang chờ nhận quà</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase text-slate-400">Tổng thanh toán</span>
                <span className="text-2xl font-black text-[#C30909]">{formatVND(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}