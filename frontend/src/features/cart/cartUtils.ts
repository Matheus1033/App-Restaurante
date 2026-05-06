import type { CartItem } from "./cartTypes";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

export const getTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );

  return { totalQuantity, subtotal, total: subtotal };
};
