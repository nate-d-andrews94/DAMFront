import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    // In Vitest 3, includeSource is recommended for better performance
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/src/test/**'],
    },
    // Improved watch mode with Vitest 3
    watch: {
      include: ['src/**'],
      exclude: ['node_modules', 'dist', 'coverage'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});