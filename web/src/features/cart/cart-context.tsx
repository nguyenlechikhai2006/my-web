"use client";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { CartAction, CartState } from "@/types/cart";

const LS_KEY = "keddy:cart";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      // CẢI TIẾN: Sử dụng một định danh duy nhất (ưu tiên id, sau đó đến productId)
      const newItemId = action.payload.id || action.payload.productId;
      
      const idx = state.items.findIndex((it) => {
        const currentItemId = it.id || it.productId;
        return currentItemId === newItemId;
      });
      
      if (idx >= 0) {
        const next = [...state.items];
        const cur = next[idx];
        // Đảm bảo cộng dồn số lượng chính xác
        next[idx] = { 
          ...cur, 
          quantity: Number(cur.quantity || 0) + Number(action.payload.quantity || 1) 
        };
        return { items: next };
      }
      
      // Nếu là sản phẩm mới, đảm bảo có quantity tối thiểu là 1
      const itemToAdd = { 
        ...action.payload, 
        quantity: Number(action.payload.quantity || 1) 
      };
      return { items: [...state.items, itemToAdd] };
    }

    case "REMOVE":
      return { 
        items: state.items.filter((it) => (it.id || it.productId) !== action.payload.productId) 
      };

    case "SET_QTY":
      return {
        items: state.items.map((it) =>
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

  // Chỉ lưu vào localStorage sau khi đã Hydrated để tránh ghi đè data trống lên data cũ
  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(LS_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

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