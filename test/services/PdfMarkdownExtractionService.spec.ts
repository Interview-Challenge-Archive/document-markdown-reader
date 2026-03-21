import { describe, expect, it, vi } from 'vitest'
import { InvalidPdfError } from '../../src/errors/InvalidPdfError'
import { UnreadablePdfError } from '../../src/errors/UnreadablePdfError'
import type { PdfDocumentProxy } from '../../src/interfaces/PdfDocumentProxy'
import type { PdfJsModule } from '../../src/interfaces/PdfJsModule'
import type { PdfPageTextItem } from '../../src/interfaces/PdfPageTextItem'
import { PdfMarkdownExtractionService } from '../../src/services/PdfMarkdownExtractionService'
import type { PdfJsService } from '../../src/services/PdfJsService'

function createTextItem(
  text: string,
  x: number,
  y: number,
  width: number
): PdfPageTextItem {
  return {
    str: text,
    width,
    transform: [1, 0, 0, 1, x, y]
  }
}

function createExtractionService(getDocument: PdfJsModule['getDocument']): PdfMarkdownExtractionService {
  return new PdfMarkdownExtractionService({
    getModule: () => ({ getDocument })
  } as unknown as PdfJsService)
}

describe('PdfMarkdownExtractionService', () => {
  it('extracts line-aware markdown text from PDF pages', async () => {
    const pdfDocument: PdfDocumentProxy = {
      numPages: 2,
      getPage: vi.fn(async (pageNumber: number) => ({
        async getTextContent() {
          if (pageNumber === 1) {
            return {
              items: [
                createTextItem('Hello', 0, 100, 20),
                createTextItem('world', 32, 100, 20),
                createTextItem('Second line', 0, 76, 35)
              ]
            }
          }

          return {
            items: [
              createTextItem('Page', 0, 100, 18),
              createTextItem('two', 26, 100, 12)
            ]
          }
        }
      })),
      destroy: vi.fn(async () => {})
    }
    const getDocument = vi.fn().mockReturnValue({
      promise: Promise.resolve(pdfDocument)
    })
    const pdfMarkdownExtractionService = createExtractionService(getDocument)

    const markdown = await pdfMarkdownExtractionService.extractMarkdown(new ArrayBuffer(8))
    expect(markdown).toContain('Hello   world')
    expect(markdown).toContain('\n\nSecond line')
    expect(markdown).toContain('\n\nPage  two')
    expect(pdfDocument.destroy).toHaveBeenCalledTimes(1)
  })

  it('throws unreadable error for textless PDFs', async () => {
    const pdfDocument: PdfDocumentProxy = {
      numPages: 1,
      getPage: vi.fn(async () => ({
        async getTextContent() {
          return {
            items: [createTextItem('   ', 0, 100, 10)]
          }
        }
      })),
      destroy: vi.fn()
    }
    const getDocument = vi.fn().mockReturnValue({
      promise: Promise.resolve(pdfDocument)
    })
    const pdfMarkdownExtractionService = createExtractionService(getDocument)

    await expect(pdfMarkdownExtractionService.extractMarkdown(new ArrayBuffer(1))).rejects.toBeInstanceOf(
      UnreadablePdfError
    )
    expect(pdfDocument.destroy).toHaveBeenCalledTimes(1)
  })

  it('throws invalid error for parser failures', async () => {
    const getDocument = vi.fn().mockReturnValue({
      promise: Promise.reject(new Error('parse failed'))
    })
    const pdfMarkdownExtractionService = createExtractionService(getDocument)

    await expect(pdfMarkdownExtractionService.extractMarkdown(new ArrayBuffer(3))).rejects.toBeInstanceOf(
      InvalidPdfError
    )
  })

  it('ignores cleanup errors while still returning extracted markdown', async () => {
    const pdfDocument: PdfDocumentProxy = {
      numPages: 1,
      getPage: vi.fn(async () => ({
        async getTextContent() {
          return {
            items: [createTextItem('Done', 0, 100, 20)]
          }
        }
      })),
      destroy: vi.fn(async () => {
        throw new Error('cleanup failed')
      })
    }
    const getDocument = vi.fn().mockReturnValue({
      promise: Promise.resolve(pdfDocument)
    })
    const pdfMarkdownExtractionService = createExtractionService(getDocument)

    await expect(pdfMarkdownExtractionService.extractMarkdown(new ArrayBuffer(4))).resolves.toBe('Done')
    expect(pdfDocument.destroy).toHaveBeenCalledTimes(1)
  })
})
