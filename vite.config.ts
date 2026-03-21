import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        target: 'es2020'
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DocumentMarkdownReader',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        '@jose.espana/docstream',
        'jszip',
        'mammoth/mammoth.browser',
        'marked',
        'pdfjs-dist/legacy/build/pdf.mjs',
        'turndown',
        'turndown-plugin-gfm'
      ]
    }
  },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.spec.ts'],
    setupFiles: ['./test/setup.ts']
  }
})
