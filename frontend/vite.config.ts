import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Meu Restaurante",
        short_name: "Restaurante",
        start_url: "/",
        display: "standalone",
        background_color: "#020617",
        theme_color: "#f97316",
        icons: [
          {
            src: "./public/assets/images/Logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./public/assets/images/Logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
