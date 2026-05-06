import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTotals } from "./cartUtils";
const STORAGE_KEY = "restaurant-cart-v1";
const CartContext = createContext(undefined);
export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                setItems(JSON.parse(raw));
            }
            catch {
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
    const value = useMemo(() => ({
        items,
        ...totals,
        addToCart: (item) => {
            setItems((current) => {
                const found = current.find((cartItem) => cartItem.id === item.id);
                if (found) {
                    return current.map((cartItem) => cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem);
                }
                return [...current, { ...item, quantity: 1 }];
            });
        },
        removeFromCart: (id) => {
            setItems((current) => current.filter((item) => item.id !== id));
        },
        increment: (id) => {
            setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
        },
        decrement: (id) => {
            setItems((current) => current.map((item) => item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item));
        },
        clearCart: () => setItems([]),
        isLoading,
    }), [isLoading, items, totals]);
    return _jsx(CartContext.Provider, { value: value, children: children });
};
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart deve ser usado com CartProvider");
    }
    return context;
};
