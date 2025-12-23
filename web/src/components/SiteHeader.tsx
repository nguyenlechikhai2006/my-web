"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react"; 
import { cn } from "@/lib/cn";
import { Search, ShoppingCart, User, Phone, Snowflake, ChevronDown, LogOut } from "lucide-react"; 
import CartIndicator from "@/components/CartIndicator";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  
  const [userName, setUserName] = useState<string | null>(null);

  // --- PHẦN LOGIC CẬP NHẬT TỨC THÌ ---
  useEffect(() => {
    // Hàm kiểm tra và cập nhật tên từ localStorage
    const checkUser = () => {
      const storedName = localStorage.getItem("userName");
      setUserName(storedName);
    };

    // Kiểm tra ngay khi component mount
    checkUser();

    // Lắng nghe sự kiện 'storage' (khi tab khác thay đổi localStorage)
    window.addEventListener("storage", checkUser);

    // Lắng nghe sự kiện tùy chỉnh nếu đăng nhập cùng tab (giúp hiện tên ngay lập tức)
    window.addEventListener("userLogin", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("userLogin", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    setUserName(null);
    router.push("/");
    router.refresh();
  };
  // ---------------------------------

  const [activeMenu, setActiveMenu] = useState<null | 'cho' | 'meo' | 'all'>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const NavItem = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link
      href={href}
      className={cn(
        "text-white font-medium hover:text-yellow-300 transition-colors whitespace-nowrap py-1 border-b-2 border-transparent hover:border-yellow-300 flex items-center gap-1",
        pathname === href && "text-yellow-300 font-bold border-yellow-300",
        className
      )}
    >
      {children}
    </Link>
  );

  const MegaMenuPet = ({ type }: { type: 'cho' | 'meo' }) => {
    const isDog = type === 'cho';
    return (
      <div className="absolute top-full left-0 w-[700px] bg-[#f8f9fa] shadow-2xl rounded-b-2xl p-8 grid grid-cols-3 gap-8 z-[100] border-t-4 border-yellow-400 animate-in fade-in slide-in-from-top-2 duration-200">
        <div>
          <h3 className="text-[#1e4eb8] font-black mb-4 uppercase text-[15px] border-b border-gray-200 pb-2">Thức Ăn Cho {isDog ? 'Chó' : 'Mèo'}</h3>
          <ul className="space-y-3 text-gray-700 text-[14px]">
            <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href={`/shop?category=${type}&sub=hat`}>Thức Ăn Hạt</Link></li>
            <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href={`/shop?category=${type}&sub=uot`}>Thức Ăn Ướt</Link></li>
            <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href={`/shop?category=${type}&sub=dieu-tri`}>Thức Ăn Điều Trị Bệnh</Link></li>
            {isDog ? (
              <>
                <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href="/shop?category=cho&sub=huu-co">Thức Ăn Hữu Cơ</Link></li>
                <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href="/shop?category=cho&sub=khong-ngu-coc">Thức Ăn Không Ngũ Cốc</Link></li>
              </>
            ) : (
              <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href="/shop?category=meo&sub=banh-thuong">Bánh Thưởng Mèo</Link></li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-[#1e4eb8] font-black mb-4 uppercase text-[15px] border-b border-gray-200 pb-2">Phụ kiện & Đồ chơi</h3>
          <ul className="space-y-3 text-gray-700 text-[14px]">
            <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href="/shop?category=phu-kien&sub=do-choi">Đồ Chơi</Link></li>
            <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href="/shop?category=phu-kien&sub=vong-co">Vòng Cổ - Dây Dắt</Link></li>
            <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href="/shop?category=phu-kien&sub=dung-cu">Dụng Cụ Ăn Uống</Link></li>
            <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href={`/shop?category=phu-kien&sub=nem-chuong`}>Nệm - Chuồng Cho {isDog ? 'Chó' : 'Mèo'}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[#1e4eb8] font-black mb-4 uppercase text-[15px] border-b border-gray-200 pb-2">Vệ Sinh</h3>
          <ul className="space-y-3 text-gray-700 text-[14px]">
            <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href="/shop?category=ve-sinh&sub=xit-khu-mui">Xịt Khử Mùi</Link></li>
            <li className="hover:text-blue-600 transition-all hover:translate-x-1"><Link href={`/shop?category=ve-sinh&sub=sua-tam`}>Sữa Tắm {isDog ? 'Chó' : 'Mèo'}</Link></li>
          </ul>
        </div>
      </div>
    );
  };

  const MegaMenuAll = () => (
    <div className="absolute top-full left-0 w-[1100px] bg-[#f8f9fa] shadow-2xl rounded-b-2xl p-10 grid grid-cols-5 gap-6 z-[100] border-t-4 border-yellow-400 animate-in fade-in slide-in-from-top-2 duration-200">
      <div>
        <h3 className="text-[#1e4eb8] font-black mb-5 uppercase text-[14px] border-b pb-2">Thức Ăn Cho Chó</h3>
        <ul className="space-y-3 text-gray-700 text-[13px]">
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=cho&sub=hat">Thức Ăn Hạt</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=cho&sub=uot">Thức Ăn Ướt</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=cho&sub=dieu-tri">Thức Ăn Hỗ Trợ Điều Trị Bệnh</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=cho&sub=huu-co">Thức Ăn Hữu Cơ</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=cho&sub=khong-ngu-coc">Thức Ăn Không Ngũ Cốc</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-[#1e4eb8] font-black mb-5 uppercase text-[14px] border-b pb-2">Thức Ăn Cho Mèo</h3>
        <ul className="space-y-3 text-gray-700 text-[13px]">
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=meo&sub=hat">Thức Ăn Hạt</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=meo&sub=uot">Thức Ăn Ướt</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=meo&sub=dieu-tri">Thức Ăn Điều Trị Bệnh</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=meo&sub=banh-thuong">Bánh Thưởng Mèo</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-[#1e4eb8] font-black mb-5 uppercase text-[14px] border-b pb-2">Phụ kiện & Đồ chơi</h3>
        <ul className="space-y-3 text-gray-700 text-[13px]">
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=phu-kien&sub=do-choi">Đồ Chơi</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=phu-kien&sub=thoi-trang">Thời Trang - Quần Áo</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=phu-kien&sub=vong-co">Vòng Cổ - Dây Dắt</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=phu-kien&sub=dung-cu">Dụng Cụ Ăn Uống</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=phu-kien&sub=nem-chuong">Nệm - Chuồng Cho Pet</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-[#1e4eb8] font-black mb-5 uppercase text-[14px] border-b pb-2">Chăm Sóc Sức Khoẻ</h3>
        <ul className="space-y-3 text-gray-700 text-[13px]">
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=suc-khoe&sub=tpcn">Thực Phẩm Chức Năng</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=suc-khoe&sub=vitamin">Vitamin - Thực Phẩm Bổ Sung</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-[#1e4eb8] font-black mb-5 uppercase text-[14px] border-b pb-2">Vệ Sinh</h3>
        <ul className="space-y-3 text-gray-700 text-[13px]">
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=ve-sinh&sub=xit-khu-mui">Xịt Khử Mùi</Link></li>
          <li className="hover:text-blue-600 hover:translate-x-1 transition-all"><Link href="/shop?category=ve-sinh&sub=sua-tam">Sữa Tắm</Link></li>
        </ul>
      </div>
    </div>
  );

  return (
    <header className="w-full shadow-md sticky top-0 z-50">
      <div className="bg-[#1e4eb8] py-3 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <Snowflake size={12} className="absolute top-1 left-[15%] animate-pulse" />
            <Snowflake size={16} className="absolute top-4 left-[45%] animate-bounce" />
            <Snowflake size={10} className="absolute top-2 right-[10%] animate-pulse" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between gap-4 md:gap-8 relative z-10">
          <Link href="/" className="flex-shrink-0 group">
            <div className="w-14 h-14 bg-white rounded-full flex flex-col items-center justify-center border-2 border-yellow-400 overflow-hidden shadow-lg group-hover:scale-105 transition-transform relative">
              <img 
                src="anh/logo.png"
                alt="Logo"
                className="w-full h-full object-cover" 
              />
            </div>
          </Link>

          <div className="hidden md:flex flex-grow max-w-xl relative">
            <form onSubmit={handleSearch} className="flex w-full items-center bg-white rounded-full shadow-inner focus-within:ring-2 focus-within:ring-yellow-400 transition-all overflow-hidden">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Tìm thức ăn, phụ kiện, đồ chơi Noel..."
                    className="w-full h-11 px-5 text-black bg-transparent focus:outline-none placeholder:text-gray-400 text-sm"
                />
                <button type="submit" className="bg-yellow-300 hover:bg-yellow-500 text-[#1e4eb8] h-11 px-6 flex items-center justify-center transition-colors group">
                    <Search size={18} className="group-hover:scale-110 transition-transform" strokeWidth={3} />
                </button>
            </form>
          </div>

          <div className="flex items-center gap-4 md:gap-6 text-[13px]">
            <div className="hidden lg:block border-r border-blue-400/50 pr-6">
              <p className="opacity-80 text-[10px] uppercase tracking-tighter">Hotline</p>
              <p className="font-bold flex items-center gap-1 text-yellow-400 text-sm tracking-wide"><Phone size={14} className="fill-yellow-400" /> 123456789</p>
            </div>
            
            <div className="flex flex-col items-center group relative cursor-pointer" onClick={() => router.push('/cart')}>
                <div className="relative p-1">
                    <ShoppingCart size={28} className="group-hover:text-yellow-300 transition-colors drop-shadow-md" />
                    <span className="absolute -top-2 -right-3">
                        <CartIndicator /> 
                    </span>
                </div>
                <span className="hidden sm:inline font-black uppercase text-[10px] tracking-widest mt-1 group-hover:text-yellow-300">
                    Giỏ hàng 🎁
                </span>
            </div>

            {userName ? (
              <div className="flex flex-col items-center group relative">
                <div className="p-1">
                  <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-[#1e4eb8] font-bold border border-white shadow-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center gap-1 cursor-default">
                  <span className="hidden sm:inline font-bold text-yellow-300">Chào, {userName}</span>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-red-400 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="flex flex-col items-center group">
                <div className="p-1"><User size={24} className="group-hover:text-yellow-400 transition-colors" /></div>
                <span className="hidden sm:inline font-medium">Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#1E4EB8] border-t border-blue-400/30 py-2 shadow-inner">
        <div className="container mx-auto max-w-7xl px-4 flex items-center gap-6 md:gap-10 overflow-visible relative">
          <div className="relative group py-1" onMouseEnter={() => setActiveMenu('all')} onMouseLeave={() => setActiveMenu(null)}>
            <div className={cn(
              "text-white font-medium hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer border-b-2 border-transparent hover:border-yellow-300",
              (activeMenu === 'all' || pathname === '/menu') && "text-yellow-300 border-yellow-300"
            )}>
              Menu <ChevronDown size={14} className={cn("transition-transform", activeMenu === 'all' && "rotate-180")} />
            </div>
            {activeMenu === 'all' && <MegaMenuAll />}
          </div>

          <div className="relative group py-1" onMouseEnter={() => setActiveMenu('cho')} onMouseLeave={() => setActiveMenu(null)}>
            <div className={cn(
              "text-white font-medium hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer border-b-2 border-transparent hover:border-yellow-300",
              activeMenu === 'cho' && "text-yellow-300 border-yellow-300"
            )}>
              Chó 🐕 <ChevronDown size={14} className={cn("transition-transform", activeMenu === 'cho' && "rotate-180")} />
            </div>
            {activeMenu === 'cho' && <MegaMenuPet type="cho" />}
          </div>

          <div className="relative group py-1" onMouseEnter={() => setActiveMenu('meo')} onMouseLeave={() => setActiveMenu(null)}>
            <div className={cn(
              "text-white font-medium hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer border-b-2 border-transparent hover:border-yellow-300",
              activeMenu === 'meo' && "text-yellow-300 border-yellow-300"
            )}>
              Mèo 🐈 <ChevronDown size={14} className={cn("transition-transform", activeMenu === 'meo' && "rotate-180")} />
            </div>
            {activeMenu === 'meo' && <MegaMenuPet type="meo" />}
          </div>

          <NavItem href="/shop/hang-moi">Hàng mới về</NavItem>
          <NavItem href="/shop/phu-kien">Phụ kiện</NavItem>
          <NavItem href="/khuyen-mai" className="text-yellow-300">
            <span className="animate-pulse">🎁</span> Ưu đãi Noel
          </NavItem>
          
          <NavItem href="/admin" className="ml-auto opacity-40 text-[10px] hover:opacity-100 uppercase tracking-widest">
            Admin
          </NavItem>
        </div>
      </div>
    </header>
  );
}