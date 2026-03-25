import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: './',
  plugins: [
    svelte(),
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
