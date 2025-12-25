"use client";
import Link from "next/link"; // Bước quan quan trọng để liên kết trang

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0f7ff]">
      {/* Hero Section */}
      <section className="relative bg-[#4794EC] py-16 md:py-24 overflow-hidden">
        {/* Lớp phủ trang trí Noel (Hạt tuyết rơi giả lập) */}
        <div className="absolute inset-0 pointer-events-none z-0">
           <div className="absolute top-10 left-[10%] text-white opacity-20 text-2xl animate-bounce">❄️</div>
           <div className="absolute top-40 left-[40%] text-white opacity-10 text-xl animate-pulse delay-75">❄️</div>
           <div className="absolute top-20 right-[20%] text-white opacity-20 text-3xl animate-bounce delay-150">❄️</div>
           <div className="absolute bottom-10 left-[5%] text-white opacity-10 text-2xl">❄️</div>
        </div>

        {/* Họa tiết dấu chân chó trang trí mờ phía sau */}
        <div className="absolute inset-0 opacity-5 pointer-events-none text-[200px] flex flex-wrap gap-20">
          🐾 🐾 🐾 🐾
        </div>

        <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 text-white space-y-6 text-center md:text-left">
            {/* Badge Giáng Sinh */}
            <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-2xl">🎄</span>
                <h2 className="bg-red-500 text-white inline-block px-4 py-1 rounded-full font-bold text-sm uppercase tracking-widest shadow-lg">
                  Ưu đãi Giáng Sinh - Giảm 30%
                </h2>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-medium leading-tight drop-shadow-lg">
              YÊU THƯƠNG <br/> <span className="text-yellow-400">THÚ CƯNG</span>
            </h1>
            <p className="text-lg opacity-90 max-w-md">
              Mùa an lành, quà lung linh! Mọi thứ tốt nhất cho chó mèo nhà bạn: Từ thức ăn dinh dưỡng đến phụ kiện thời trang.
            </p>

            {/* PHẦN THAY ĐỔI: Liên kết nút bấm sang trang Shop */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/shop">
                <button className="bg-white text-[#1e4eb8] px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform uppercase">
                  MUA SẮM NGAY
                </button>
              </Link>
              
              <Link href="/shop">
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all uppercase">
                  XEM BỘ SƯU TẬP
                </button>
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
            {/* Trang trí xung quanh ảnh thú cưng */}
            <div className="absolute -top-10 -right-5 text-6xl z-20 drop-shadow-md rotate-12">🎁</div>
            <div className="absolute -bottom-5 -left-10 text-6xl z-20 drop-shadow-md -rotate-12">⛄</div>
            
            {/* Vòng tròn vàng trang trí sau ảnh */}
            <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-yellow-400 rounded-full blur-[80px] opacity-20 -z-10 animate-pulse"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1964&auto=format&fit=crop" 
              alt="Pet" 
              className="w-[85%] rounded-[40px] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-8 border-white/20 relative z-10"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 container mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-[#1e4eb8] font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
              <span className="text-red-500">❄️</span> Danh mục
            </h3>
            <h2 className="text-3xl font-medium text-slate-800 italic">Dành Cho Bạn </h2>
          </div>
          <Link href="/shop" className="text-[#1e4eb8] font-bold hover:underline">
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: 'Thức ăn cho Chó', i: '🍖', c: 'bg-orange-100' },
            { n: 'Cát cho Mèo', i: '🐱', c: 'bg-blue-100' },
            { n: 'Đồ chơi Noel', i: '🎅', c: 'bg-red-50' },
            { n: 'Chuồng & Đệm', i: '🏠', c: 'bg-purple-100' }
          ].map((cat) => (
            <Link key={cat.n} href={`/shop?category=${cat.n}`}>
              <div className={`${cat.c} p-8 rounded-3xl text-center hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-white relative overflow-hidden h-full`}>
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{cat.i}</div>
                <h4 className="font-bold text-slate-800">{cat.n}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}