export type MinProduct = {
    slug: string;
    title: string;
    price: number;
    image: string;
    stock: number;
};

export const MIN_PRODUCTS: MinProduct[] = [
  { slug: "san-pham-1", title: "Áo thun cổ tròn", price: 129000, image: "/placeholder.svg", stock: 12 },
  { slug: "san-pham-2", title: "Quần jeans slim", price: 459000, image: "/placeholder.svg", stock: 0 },
  { slug: "san-pham-3", title: "Giày sneaker basic", price: 799000, image: "/placeholder.svg", stock: 5 },
  { slug: "san-pham-4", title: "Túi tote canvas", price: 99000, image: "/placeholder.svg", stock: 20 },
  { slug: "san-pham-5", title: "Mũ lưỡi trai", price: 69000, image: "/placeholder.svg", stock: 3 },
  { slug: "san-pham-6", title: "Áo sơ mi kẻ", price: 259000, image: "/placeholder.svg", stock: 8 },
  { slug: "san-pham-7", title: "Váy midi", price: 349000, image: "/placeholder.svg", stock: 2 },
  { slug: "san-pham-8", title: "Áo khoác gió", price: 559000, image: "/placeholder.svg", stock: 15 },
];

// có thể thêm nhiều sản phẩm hơn nếu muốn