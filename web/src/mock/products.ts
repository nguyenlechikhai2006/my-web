// src/mock/products.ts

const createSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const RAW_PRODUCTS = [
  // ==========================================
  // NHÓM 1: THỨC ĂN CHO CHÓ (25 Sản phẩm)
  // ==========================================
  { _id: "d1", title: "Hạt Ganador Adult Vị Gà Quay", price: 18500, originalPrice: 20000, category: "cho", sub: "hat", brand: "Ganador", stock: 30, image: "/anh/d1.jpg" },
  { _id: "d2", title: "Hạt Ganador Premium Vị Cừu & Gạo", price: 22000, originalPrice: 25000, category: "cho", sub: "hat", brand: "Ganador", stock: 30, image: "/anh/d2.jpg" },
  { _id: "d3", title: "Thức Ăn Hạt Royal Canin Mini Adult", price: 199000, originalPrice: 220000, category: "cho", sub: "hat", brand: "Royal Canin", stock: 30, image: "/anh/d3.jpg" },
  { _id: "d4", title: "Hạt Cho Chó Mọi Lứa Tuổi Keos", price: 21500, originalPrice: 25000, category: "cho", sub: "hat", brand: "Keos", stock: 30, image: "/anh/d4.jpg" },
  { _id: "d5", title: "Hạt Tươi Taste Of The Wild High Prairie", price: 122000, originalPrice: 150000, category: "cho", sub: "hat", brand: "Taste of the Wild", stock: 30, image: "/anh/d5.jpg" },
  { _id: "d6", title: "Smartheart Adult Vị Bò Nướng", price: 20000, originalPrice: 25000, category: "cho", sub: "hat", brand: "Smartheart", stock: 30, image: "/anh/d6.jpg" },
  { _id: "d7", title: "Hạt Mềm Zenith Adult Cho Chó Trưởng Thành", price: 58000, originalPrice: 65000, category: "cho", sub: "hat", brand: "Zenith", stock: 30, image: "/anh/d7.jpg" },
  { _id: "d8", title: "Dr.Healmedix Hỗ Trợ Sức Khỏe", price: 408000, originalPrice: 450000, category: "cho", sub: "dieu-tri", brand: "Dr.Healmedix", stock: 30, image: "/anh/d8.jpg" },
  { _id: "d9", title: "Hạt Hữu Cơ Natural Core M50", price: 62000, originalPrice: 70000, category: "cho", sub: "huu-co", brand: "Zenith", stock: 30, image: "/anh/d9.jpg" },
  { _id: "d10", title: "Pate Monge Vị Gà & Rau Củ", price: 32000, originalPrice: 35000, category: "cho", sub: "uot", brand: "Monge", stock: 30, image: "/anh/d10.jpg" },
  { _id: "d11", title: "Xương Gặm Sạch Răng Pedigree", price: 45000, originalPrice: 50000, category: "cho", sub: "hat", brand: "Pedigree", stock: 30, image: "/anh/d11.jpg" },
  { _id: "d12", title: "Bánh Thưởng Cho Chó Jerky", price: 35000, originalPrice: 40000, category: "cho", sub: "hat", brand: "Jerky", stock: 30, image: "/anh/d12.jpg" },
  { _id: "d13", title: "Hạt Ganador Puppy Vị Sữa & DHA", price: 25000, originalPrice: 30000, category: "cho", sub: "hat", brand: "Ganador", stock: 30, image: "/anh/d13.jpg" },
  { _id: "d14", title: "Pate Royal Canin Puppy", price: 42000, originalPrice: 45000, category: "cho", sub: "uot", brand: "Royal Canin", stock: 30, image: "/anh/d14.jpg" },
  { _id: "d15", title: "Hạt Smartheart Gold Puppy", price: 55000, originalPrice: 60000, category: "cho", sub: "hat", brand: "Smartheart", stock: 30, image: "/anh/d15.jpg" },
  { _id: "d16", title: "Thức Ăn Hạt Nature's Protection", price: 310000, originalPrice: 350000, category: "cho", sub: "hat", brand: "Nature", stock: 30, image: "/anh/d16.jpg" },
  { _id: "d17", title: "Pate King's Pet Vị Cá", price: 48000, originalPrice: 55000, category: "cho", sub: "uot", brand: "King Pet", stock: 30, image: "/anh/d17.jpg" },
  { _id: "d18", title: "Hạt Royal Canin Gastroin Cho Chó Tiêu Hóa Kém", price: 280000, originalPrice: 300000, category: "cho", sub: "dieu-tri", brand: "Royal Canin", stock: 30, image: "/anh/d18.jpg" },
  { _id: "d19", title: "Xúc Xích Cho Chó Vị Bò", price: 5000, originalPrice: 7000, category: "cho", sub: "hat", brand: "Keddy", stock: 30, image: "/anh/d19.jpg" },
  { _id: "d20", title: "Hạt Zenith Light Cho Chó Giảm Cân", price: 58000, originalPrice: 65000, category: "cho", sub: "dieu-tri", brand: "Zenith", stock: 30, image: "/anh/d20.jpg" },
  { _id: "d21", title: "Hạt Ganador Adult Vị Bò", price: 18500, originalPrice: 20000, category: "cho", sub: "hat", brand: "Ganador", stock: 30, image: "/anh/d21.jpg" },
  { _id: "d22", title: "Pate Pedigree Vị Gà & Khoai Tây", price: 15000, originalPrice: 18000, category: "cho", sub: "uot", brand: "Pedigree", stock: 30, image: "/anh/d22.jpg" },
  { _id: "d23", title: "Thức Ăn Hạt Nutrience Infusion", price: 450000, originalPrice: 500000, category: "cho", sub: "khong-ngu-coc", brand: "Nutrience", stock: 30, image: "/anh/d23.jpg" },
  { _id: "d24", title: "Hạt Josera Cho Chó Nhạy Cảm", price: 220000, originalPrice: 250000, category: "cho", sub: "dieu-tri", brand: "Josera", stock: 30, image: "/anh/d24.jpg" },
  { _id: "d25", title: "Pate Lon Royal Canin Recovery", price: 85000, originalPrice: 95000, category: "cho", sub: "dieu-tri", brand: "Royal Canin", stock: 30, image: "/anh/d25.jpg" },

  // ==========================================
  // NHÓM 2: THỨC ĂN CHO MÈO (25 Sản phẩm)
  // ==========================================
  { _id: "c1", title: "Hạt Cho Mèo Mọi Lứa Tuổi Cats On", price: 62000, category: "meo", sub: "hat", brand: "Cats On", stock: 30, image: "/anh/c1.jpg" },
  { _id: "c2", title: "Hạt Minino Vị Hải Sản 1.3kg", price: 27000, category: "meo", sub: "hat", brand: "Minino", stock: 30, image: "/anh/c2.jpg" },
  { _id: "c3", title: "Hạt Catsrang Cho Mèo 1.5kg", price: 60000, category: "meo", sub: "hat", brand: "Catsrang", stock: 30, image: "/anh/c3.jpg" },
  { _id: "c4", title: "Pate Cho Mèo Me-O Wet Bò & Gà", price: 11000, category: "meo", sub: "uot", brand: "Me-O", stock: 30, image: "/anh/c4.jpg" },
  { _id: "c5", title: "Hạt Whiskas Adult Vị Cá Thu", price: 113000, category: "meo", sub: "hat", brand: "Whiskas", stock: 30, image: "/anh/c5.jpg" },
  { _id: "c6", title: "Pate Mèo Happy Choice Cá Ngừ Thạch", price: 26000, category: "meo", sub: "uot", brand: "Catchy", stock: 30, image: "/anh/c6.jpg" },
  { _id: "c7", title: "Hạt Cho Mèo Snappy Tom Mix Cá Sấy", price: 72000, category: "meo", sub: "hat", brand: "Snappy Tom", stock: 30, image: "/anh/c7.jpg" },
  { _id: "c8", title: "Pate Cho Mèo Wanpy Thịt Gà Thật", price: 13000, category: "meo", sub: "uot", brand: "Wanpy", stock: 30, image: "/anh/c8.jpg" },
  { _id: "c9", title: "Hạt Royal Canin Indoor 27", price: 132000, category: "meo", sub: "hat", brand: "Royal Canin", stock: 30, image: "/anh/c9.jpg" },
  { _id: "c10", title: "Pate Ciao Churu Gói 4 Thanh", price: 55000, category: "meo", sub: "banh-thuong", brand: "Ciao", stock: 30, image: "/anh/c10.jpg" },
  { _id: "c11", title: "Hạt Reflex Adult Vị Thịt Gà", price: 145000, category: "meo", sub: "hat", brand: "Reflex", stock: 30, image: "/anh/c11.jpg" },
  { _id: "c12", title: "Pate Nekko Vị Cá Ngừ & Tôm", price: 18000, category: "meo", sub: "uot", brand: "Nekko", stock: 30, image: "/anh/c12.jpg" },
  { _id: "c13", title: "Hạt Minino Vị Cá Ngừ", price: 25000, category: "meo", sub: "hat", brand: "Blisk", stock: 30, image: "/anh/c13.jpg" },
  { _id: "c14", title: "Pate King's Pet Vị Cá Cam", price: 45000, category: "meo", sub: "uot", brand: "King Pet", stock: 30, image: "/anh/c14.jpg" },
  { _id: "c15", title: "Hạt Nutrience Subzero Fraser Valley", price: 650000, category: "meo", sub: "hat", brand: "Nutrience", stock: 30, image: "/anh/c15.jpg" },
  { _id: "c16", title: "Cát Vệ Sinh Đậu Nành Tofu 6L", price: 155000, category: "meo", sub: "hat", brand: "Tofu", stock: 30, image: "/anh/c16.jpg" },
  { _id: "c17", title: "Hạt Me-O Gold Cho Mèo Con", price: 185000, category: "meo", sub: "hat", brand: "Me-O", stock: 30, image: "/anh/c17.jpg" },
  { _id: "c18", title: "Pate Nutri Plan Vị Cá Hồi", price: 22000, category: "meo", sub: "uot", brand: "Nutri Plan", stock: 30, image: "/anh/c18.jpg" },
  { _id: "c19", title: "Hạt Teb City Vị Cá Tuyết", price: 320000, category: "meo", sub: "hat", brand: "Teb", stock: 30, image: "/anh/c19.jpg" },
  { _id: "c20", title: "Cỏ Mèo Bạc Hà Catnip", price: 15000, category: "meo", sub: "banh-thuong", brand: "Keddy", stock: 30, image: "/anh/c20.jpg" },
  { _id: "c21", title: "Hạt Cho Mèo Mọi Lứa Tuổi Keos", price: 65000, category: "meo", sub: "hat", brand: "Cats On", stock: 30, image: "/anh/c21.jpg" },
  { _id: "c22", title: "Pate Shizuka Cho Mèo", price: 8000, category: "meo", sub: "uot", brand: "Shizuka", stock: 30, image: "/anh/c22.jpg" },
  { _id: "c23", title: "Hạt Tuna flavor Cat Vị Cá Ngừ", price: 110000, category: "meo", sub: "hat", brand: "Home Cat", stock: 30, image: "/anh/c23.jpg" },
  { _id: "c24", title: "Pate Kit Cat Goat Milk", price: 35000, category: "meo", sub: "uot", brand: "Kit Cat", stock: 30, image: "/anh/c24.jpg" },
  { _id: "c25", title: "Súp Thưởng Wanpy Gói 5 Thanh", price: 28000, category: "meo", sub: "banh-thuong", brand: "Wanpy", stock: 30, image: "/anh/c25.jpg" },

  // ==========================================
  // NHÓM 3: PHỤ KIỆN, VỆ SINH & SỨC KHỎE (10 Sản phẩm)
  // ==========================================
  { _id: "s1", title: "Thực Phẩm Chức Năng Bổ Khớp", price: 180000, originalPrice: 200000, category: "suc-khoe", sub: "tpcn", brand: "Keddy Care", stock: 30, image: "/anh/s1.jpg" },
  { _id: "s2", title: "Vitamin Bổ Sung Cho Pet", price: 95000, originalPrice: 110000, category: "suc-khoe", sub: "vitamin", brand: "Keddy Care", stock: 30, image: "/anh/s2.jpg" },
  { _id: "v1", title: "Xịt Khử Mùi Chuồng Trại", price: 65000, originalPrice: 75000, category: "ve-sinh", sub: "xit-khu-mui", brand: "Clean Pet", stock: 30, image: "/anh/v1.jpg" },
  { _id: "v2", title: "Sữa Tắm Chó SOS Màu Nâu", price: 125000, originalPrice: 140000, category: "ve-sinh", sub: "sua-tam", brand: "SOS", stock: 30, image: "/anh/v2.jpg" },
  { _id: "v3", title: "Sữa Tắm Mèo Lee & Webster", price: 185000, originalPrice: 200000, category: "ve-sinh", sub: "sua-tam", brand: "Lee Webster", stock: 30, image: "/anh/v3.jpg" },
  { _id: "p1", title: "Đồ Chơi Gà La Hét", price: 25000, originalPrice: 30000, category: "phu-kien", sub: "do-choi", brand: "Keddy", stock: 30, image: "/anh/p1.jpg" },
  { _id: "p2", title: "Vòng Cổ Chuông Noel", price: 35000, originalPrice: 45000, category: "phu-kien", sub: "vong-co", brand: "Keddy Fashion", stock: 30, image: "/anh/p2.jpg" },
  { _id: "p3", title: "Bộ Dây Dắt Yếm Cho Chó", price: 75000, originalPrice: 90000, category: "phu-kien", sub: "vong-co", brand: "Keddy", stock: 30, image: "/anh/p3.jpg" },
  { _id: "p4", title: "Áo Len Noel Cho Thú Cưng", price: 120000, originalPrice: 150000, category: "phu-kien", sub: "thoi-trang", brand: "Keddy Fashion", stock: 30, image: "/anh/p4.jpg" },
  { _id: "p5", title: "Nệm Bông Hình Bàn Chân", price: 250000, originalPrice: 280000, category: "phu-kien", sub: "nem-chuong", brand: "Keddy", stock: 30, image: "/anh/p5.jpg" }
];

// Hàm viết mô tả chi tiết tự động dựa trên sub-category
const getDetailDescription = (p: any) => {
  const pet = p.category === 'cho' ? 'chó' : 'mèo';
  if (p.sub === 'hat') {
    return `${p.title} là dòng thức ăn khô cao cấp từ thương hiệu ${p.brand}, được thiết kế đặc biệt để đáp ứng nhu cầu dinh dưỡng hàng ngày của ${pet}. Công thức chứa protein chất lượng cao hỗ trợ phát triển cơ bắp, cùng với Omega 3&6 cho làn da khỏe mạnh và bộ lông bóng mượt. Hạt có kích thước vừa phải, giúp giảm mảng bám răng hiệu quả.`;
  }
  if (p.sub === 'uot') {
    return `${p.title} mang đến bữa ăn thơm ngon, giàu độ ẩm, cực kỳ phù hợp cho những chú ${pet} kén ăn. Với nguyên liệu tươi ngon từ thịt và cá thật, sản phẩm của ${p.brand} cung cấp nguồn nước dồi dào, hỗ trợ hệ tiết niệu và tiêu hóa khỏe mạnh. Có thể dùng trực tiếp hoặc trộn cùng hạt để tăng hương vị hấp dẫn.`;
  }
  if (p.category === 'phu-kien' || p.category === 've-sinh') {
    return `${p.title} là phụ kiện không thể thiếu từ thương hiệu ${p.brand} khi chăm sóc ${pet}. Thiết kế thông minh đảm bảo sự thoải mái tối đa cho thú cưng và tiện lợi cho chủ nuôi. Chất liệu bền bỉ, an toàn tuyệt đối và dễ dàng vệ sinh sau khi sử dụng.`;
  }
  return `${p.title} từ thương hiệu ${p.brand} là lựa chọn tin cậy cho những người chủ quan tâm đến chế độ dinh dưỡng và sự phát triển toàn diện của vật nuôi.`;
};

// Làm giàu dữ liệu: Thêm slug, description chuyên sâu, flavors và sizes hỗ trợ nhảy giá
export const PRODUCTS = RAW_PRODUCTS.map(p => {
  // Tạo danh sách Hương vị mặc định dựa trên loại sản phẩm
  const defaultFlavors = p.sub === 'uot' 
    ? ["Cá Ngừ + Cá Bào", "Cá Ngừ + Rong Biển", "Cá Ngừ + Thanh Cua", "Cá Ngừ + Gà"] 
    : ["Vị Truyền Thống", "Vị Bò Nướng", "Vị Gà Quay", "Vị Cừu & Gạo"];

  // LOGIC NHẢY GIÁ: Mỗi size là một object chứa nhãn và số tiền cộng thêm (extra)
  const defaultSizes = p.sub === 'hat' 
    ? [
        { label: "400g", extra: 0 },
        { label: "1.5kg", extra: 45000 },
        { label: "3kg", extra: 125000 },
        { label: "10kg", extra: 450000 }
      ] 
    : [
        { label: "1 Gói", extra: 0 },
        { label: "Combo 12", extra: 155000 },
        { label: "Combo 24", extra: 300000 }
      ];

  return {
    ...p,
    slug: createSlug(p.title),
    images: [p.image],
    flavors: p.category === 'phu-kien' ? null : defaultFlavors,
    sizes: defaultSizes, // Mảng các object chứa giá cộng thêm
    description: getDetailDescription(p)
  };
});