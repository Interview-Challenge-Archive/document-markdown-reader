import { describe, expect, it, vi } from 'vitest'
import * as pdfJsModule from 'pdfjs-dist/legacy/build/pdf.min.mjs'
import { PdfJsService } from '../../../src/services/PdfJsService'

vi.mock('pdfjs-dist/legacy/build/pdf.min.mjs', () => ({
  getDocument: vi.fn()
}))

describe('PdfJsService', () => {
  it('returns the pdf.js module bridge', () => {
    const pdfJsService = new PdfJsService()
    const module = pdfJsService.getModule()

    expect(module).toBe(pdfJsModule as unknown)
    expect(typeof module.getDocument).toBe('function')
  })
})
