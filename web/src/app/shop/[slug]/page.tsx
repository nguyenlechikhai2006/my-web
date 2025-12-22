import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { formatVND } from "@/lib/format";
import ProductActions from "@/features/products/ProductActions"; 
import { ShieldCheck, Truck, RotateCcw, ArrowLeft, ChevronRight, Star, Snowflake, Gift } from "lucide-react"; 

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const product = getProductBySlug(slug);
    return { title: product ? `${product.title} — Cửa hàng Keddy Noel` : "Sản phẩm — Keddy" };
}

export default async function ProductDetailPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) return notFound();

    const { title, price, originalPrice, images, stock, brand, description } = product;
    const image = images?.[0] ?? "/placeholder.svg";
    const isDeal = originalPrice && originalPrice > price;

    return (
        // Đổi nền sang xanh tuyết nhạt và thêm overflow-hidden cho tuyết rơi
        <main className="py-8 container mx-auto px-4 min-h-screen max-w-7xl relative overflow-hidden bg-[#f8fbff]">
            
            {/* HIỆU ỨNG TUYẾT RƠI NỀN */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
                {[...Array(10)].map((_, i) => (
                    <Snowflake 
                        key={i} 
                        size={24} 
                        className="absolute text-blue-200 animate-bounce" 
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 4 + 3}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                {/* HỆ THỐNG ĐIỀU HƯỚNG & NÚT BACK */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-red-600 transition">Trang chủ</Link>
                        <ChevronRight size={14} />
                        <Link href="/shop" className="hover:text-red-600 transition">Cửa hàng</Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-bold truncate max-w-[200px] md:max-w-none text-green-700">
                            🎄 {title}
                        </span>
                    </nav>

                    <Link 
                        href="/shop" 
                        className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800 transition group w-fit bg-white px-4 py-2 rounded-full shadow-sm border border-red-100"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Quay lại cửa hàng Noel
                    </Link>
                </div>

                {/* KHỐI NỘI DUNG CHÍNH - Đổi viền sang Đỏ Noel nhạt */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-5 md:p-10 rounded-[2.5rem] shadow-xl border-2 border-red-50">
                    
                    {/* BÊN TRÁI: HÌNH ẢNH */}
                    <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-50 bg-gray-50 group">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        {isDeal && (
                            // Đổi nhãn tiết kiệm thành phong cách Hộp quà
                            <div className="absolute left-5 top-5 bg-red-600 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-2xl animate-tada flex items-center gap-2">
                                <Gift size={16} />
                                GIẢM {formatVND(originalPrice - price)}
                            </div>
                        )}
                        {/* Thêm sticker bông tuyết góc ảnh */}
                        <div className="absolute right-5 bottom-5 text-blue-100 rotate-12">
                            <Snowflake size={80} strokeWidth={1} />
                        </div>
                    </div>

                    {/* BÊN PHẢI: THÔNG TIN CHI TIẾT */}
                    <div className="flex flex-col h-full">
                        <div className="mb-4">
                            <span className="inline-block bg-red-50 text-red-600 font-black text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full border border-red-100">
                                🎅 {brand || "Keddy Christmas Edition"}
                            </span>
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2 uppercase italic group">
                            {title}
                        </h1>

                        {/* ĐÁNH GIÁ SAO */}
                        <div className="flex items-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-xs text-green-700 ml-2 font-bold uppercase tracking-tighter">
                                ✨ Sản phẩm yêu thích mùa lễ hội
                            </span>
                        </div>

                        <div className="flex items-baseline gap-4 mb-8">
                            {/* Đổi màu giá chính sang Đỏ Noel */}
                            <span className="text-5xl font-black text-[#C41E3A] drop-shadow-sm">
                                {formatVND(price)}
                            </span>
                            {isDeal && (
                                <span className="text-xl text-gray-300 line-through font-medium decoration-red-300">
                                    {formatVND(originalPrice)}
                                </span>
                            )}
                        </div>

                        {/* MÔ TẢ NGẮN - Đổi viền sang Xanh lá Noel */}
                        <div className="mb-2">
                            {description && (
                                <p className="text-gray-600 leading-relaxed text-[15px] border-l-4 border-green-600 pl-4 py-2 bg-green-50/30 rounded-r-xl">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* COMPONENT XỬ LÝ LỰA CHỌN */}
                        <div className="my-6">
                            <ProductActions product={product as any} />
                        </div>

                        {/* DỊCH VỤ ĐI KÈM - Đổi sang màu Xanh & Đỏ */}
                        <div className="grid grid-cols-3 gap-4 border-t border-red-50 pt-8 mt-4">
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="p-3 bg-red-50 rounded-full text-red-600 group-hover:scale-110 transition-transform">
                                    <Truck size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Giao quà nhanh</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="p-3 bg-green-50 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase">An toàn cho Pet</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="p-3 bg-yellow-50 rounded-full text-yellow-600 group-hover:scale-110 transition-transform">
                                    <RotateCcw size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Đổi trả 7 ngày</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}