import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        global: false,
        process: false,
        Buffer: false
      }
    })
  ],
  build: {
    target: 'es2020',
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
})
