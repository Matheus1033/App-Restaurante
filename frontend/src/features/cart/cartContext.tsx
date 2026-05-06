import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, MenuItem } from "./cartTypes";
import { getTotals } from "./cartUtils";

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  total: number;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  clearCart: () => void;
  isLoading: boolean;
};

const STORAGE_KEY = "restaurant-cart-v1";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw) as CartItem[]);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoading]);

  const totals = useMemo(() => getTotals(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ...totals,
      addToCart: (item) => {
        setItems((current) => {
          const found = current.find((cartItem) => cartItem.id === item.id);
          if (found) {
            return current.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem,
            );
          }
          return [...current, { ...item, quantity: 1 }];
        });
      },
      removeFromCart: (id) => {
        setItems((current) => current.filter((item) => item.id !== id));
      },
      increment: (id) => {
        setItems((current) =>
          current.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        );
      },
      decrement: (id) => {
        setItems((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item,
          ),
        );
      },
      clearCart: () => setItems([]),
      isLoading,
    }),
    [isLoading, items, totals],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado com CartProvider");
  }
  return context;
};
