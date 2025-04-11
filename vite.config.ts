import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  // Add optimizeDeps for better performance
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'styled-components'],
  },
  build: {
    // Enable source maps for production build
    sourcemap: true,
    // Minimize output
    minify: 'terser',
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['styled-components', 'react-icons'],
        },
      },
    },
  },
});