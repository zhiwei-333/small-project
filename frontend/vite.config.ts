import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base:"/",
  server: {
    port: 5000,         // 👈 Force Vite to use port 3000
    strictPort: false,   // 👈 Optional: fail instead of using another port
    
    proxy: {
      "/api": {
        target: "https://todo.huozhong.us",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
