import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { CartProvider } from "./features/cart/cartContext";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(CartProvider, { children: _jsx(App, {}) }) }));
