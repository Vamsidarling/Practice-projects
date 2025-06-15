import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base: command === "serve" ? "/" : "/Practice-projects/",
  base: '/Practice-projects/',
 
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
