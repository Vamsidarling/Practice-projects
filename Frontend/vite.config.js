import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base: command === "serve" ? "/" : "/Practice-projects/",
  // base: "/Practice-projects/",
  base: '/',
  server: {
    proxy: {
      "/user": {
        // Match your actual API endpoint path
        target: "http://localhost:3000",
        changeOrigin: true,
        credentials: true,
      },
    },
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: undefined,
        //   assetFileNames: 'assets/[name].[hash].[ext]',
        // chunkFileNames: 'assets/[name].[hash].js',
        // entryFileNames: 'assets/[name].[hash].js'
      },
    },
  },
});
