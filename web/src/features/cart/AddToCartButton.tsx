"use client";
import { useCart } from "@/features/cart/cart-context";
import type { Product } from "@/types/product";
import { productToCartItem } from "@/types/cart";

// Định nghĩa kiểu dữ liệu cho các tham số (Props)
interface AddToCartButtonProps {
    product: Product;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
}

export default function AddToCartButton({
    product,
    disabled,
    fullWidth = true,
    className = "",
}: AddToCartButtonProps) {
    // Sử dụng hàm addItem từ CartContext đã chuẩn bị sẵn
    const { addItem } = useCart(); 

    const base = "h-10 text-sm rounded-md border hover:bg-gray-50 disabled:opacity-40 transition-colors";
    const width = fullWidth ? "w-full" : "px-4";

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Ngăn việc nhấn vào card sản phẩm
                
                // CHỈNH SỬA QUAN TRỌNG: Đảm bảo product luôn có ID trước khi convert
                // Nếu API trả về _id, chúng ta gán nó vào id để productToCartItem làm việc chính xác
                const productWithId = {
                    ...product,
                    id: product._id || product._id,
                    productId: product._id || product._id
                };

                // Thực hiện thêm sản phẩm vào giỏ với object đã chuẩn hóa
                const cartItem = productToCartItem(productWithId, 1);
                
                // Log để kiểm tra trong Console (F12)
                console.log("Adding to cart:", cartItem);
                
                addItem(cartItem);
            }}
            className={`${base} ${width} ${className} bg-white text-black font-medium`}
        >
            Thêm vào giỏ
        </button>
    );
}