import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,         // 👈 Force Vite to use port 3000
    strictPort: true,   // 👈 Optional: fail instead of using another port
    
    proxy: {
      "/api": {
        target: ":3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
