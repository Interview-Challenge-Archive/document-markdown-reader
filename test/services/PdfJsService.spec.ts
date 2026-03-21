import { describe, expect, it, vi } from 'vitest'

vi.mock('pdfjs-dist/legacy/build/pdf.mjs', () => ({
  getDocument: vi.fn()
}))

import * as pdfJsModule from 'pdfjs-dist/legacy/build/pdf.mjs'
import { PdfJsService } from '../../src/services/PdfJsService'

describe('PdfJsService', () => {
  it('returns the pdf.js module bridge', () => {
    const pdfJsService = new PdfJsService()
    const module = pdfJsService.getModule()

    expect(module).toBe(pdfJsModule as unknown)
    expect(typeof module.getDocument).toBe('function')
  })
})
