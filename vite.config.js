import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The helpdesk-api server has no CORS, so API calls go through the dev proxy.
// The /api prefix keeps server paths (/tickets, /auth...) separate from the app's own routes.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
