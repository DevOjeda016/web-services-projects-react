import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// En desarrollo, las llamadas a /api se redirigen al backend Express (puerto 3004).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4200,
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: false,
      },
    },
  },
});
