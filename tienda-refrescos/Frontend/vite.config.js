import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En desarrollo, las llamadas a /api se redirigen al backend Express.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": "http://localhost:3001"
    }
  }
});
