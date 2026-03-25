import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        global: false,
        process: false,
        Buffer: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@jose.espana/docstream': '@jose.espana/docstream/dist/officeparser.browser.js',
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
  server: {
    port: 3000,
  },
});
