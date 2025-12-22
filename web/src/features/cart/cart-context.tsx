"use client";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { CartAction, CartState } from "@/types/cart";

const LS_KEY = "keddy:cart";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      // SỬA: Tìm theo id (nếu có) hoặc productId để phân biệt được các loại size/vị từ trang Detail
      const idx = state.items.findIndex((it) => 
        (it.id === action.payload.id) || (it.productId === action.payload.productId && !it.id)
      );
      
      if (idx >= 0) {
        const next = [...state.items];
        const cur = next[idx];
        next[idx] = { ...cur, quantity: Number(cur.quantity) + Number(action.payload.quantity) };
        return { items: next };
      }
      return { items: [...state.items, action.payload] };
    }

    case "REMOVE":
      // SỬA: Lọc theo id để xóa chính xác sản phẩm cụ thể
      return { 
        items: state.items.filter((it) => (it.id || it.productId) !== action.payload.productId) 
      };

    case "SET_QTY":
      return {
        items: state.items.map((it) =>
          // SỬA: Kiểm tra khớp id hoặc productId để tăng giảm đúng dòng
          (it.id || it.productId) === action.payload.productId
            ? { ...it, quantity: Math.max(1, Number(action.payload.quantity)) }
            : it
        ),
      };

    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

function loadInitial(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as CartState) : { items: [] };
  } catch {
    return { items: [] };
  }
}

const CartCtx = createContext<{
  state: CartState;
  totalItems: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    window.localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => setHydrated(true), []);

  const totalItems = useMemo(() => 
    state.items.reduce((s, it) => s + Number(it.quantity || 0), 0), 
    [state.items]
  );
  
  const subtotal = useMemo(() => 
    state.items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0), 
    [state.items]
  );

  const addItem = (item: any) => dispatch({ type: "ADD", payload: item });
  
  // SỬA: Truyền id vào đây để khớp với logic xử lý ở trên
  const removeItem = (id: string) => dispatch({ type: "REMOVE", payload: { productId: id } });
  
  const updateQuantity = (id: string, quantity: number) => 
    dispatch({ type: "SET_QTY", payload: { productId: id, quantity } });

  const clearCart = () => dispatch({ type: "CLEAR" });

  const value = useMemo(() => ({ 
    state, 
    totalItems, 
    subtotal, 
    hydrated,
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart 
  }), [state, totalItems, subtotal, hydrated]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}