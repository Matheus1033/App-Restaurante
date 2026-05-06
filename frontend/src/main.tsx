import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { CartProvider } from "./features/cart/cartContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
);
