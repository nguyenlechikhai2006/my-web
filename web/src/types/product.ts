export type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  rating?: number;
  brand?: string;
  variants?: { color: string; size?: string }[];
  description?: string;
  category?: string;
};