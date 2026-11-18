import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite config for Arun Vineeth portfolio.
 *
 * During development the React dev-server proxies /api/* to Tomcat
 * running on port 8080. This avoids CORS issues in local development.
 *
 * In production the React build output (dist/) is copied into the
 * Tomcat WAR, so both the frontend and APIs are served from the same
 * origin. No proxy is needed in production.
 */
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Produce a single chunk per entry point to keep things simple
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
