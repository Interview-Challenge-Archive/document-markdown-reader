/// <reference types="vitest/config" />

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'
import swc from 'unplugin-swc'

const __dirname = dirname(fileURLToPath(import.meta.url))
type ViteConfigWithTest = UserConfig & {
  test: {
    environment: string
    include: string[]
    setupFiles: string[]
  }
}

const config = {
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
      formats: ['es', 'cjs'] as const,
      fileName: (format: string) => (format === 'es' ? 'index.js' : 'index.cjs')
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
    environment: 'node',
    include: ['test/**/*.spec.ts'],
    setupFiles: ['./test/setup.ts']
  }
} satisfies ViteConfigWithTest

export default defineConfig(config)
