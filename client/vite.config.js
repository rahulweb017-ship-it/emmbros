import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
  build: {
    outDir: "dist",
    // keep the mirrored asset trees (wp-content, wp-includes) copied as-is from public/
    assetsInlineLimit: 0,
  },
});
