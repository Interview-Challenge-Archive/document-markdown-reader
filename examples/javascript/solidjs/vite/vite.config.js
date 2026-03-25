import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: './',
  plugins: [
    solid(),
    nodePolyfills({
      globals: {
        global: false,
        process: false,
        Buffer: false
      }
    })
  ],
  resolve: {
    alias: {
      '@jose.espana/docstream': '@jose.espana/docstream/dist/officeparser.browser.js'
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  },
  server: {
    port: 3000
  }
});
