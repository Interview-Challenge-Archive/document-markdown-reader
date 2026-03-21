import { describe, expect, it, vi } from 'vitest'
import { FileExtensionService } from '../../src/services/FileExtensionService'
import { MimeTypeService } from '../../src/services/MimeTypeService'
import type { PdfMarkdownExtractionService } from '../../src/services/PdfMarkdownExtractionService'
import { PdfDocumentImportStrategy } from '../../src/strategies/PdfDocumentImportStrategy'
import { createTextFile } from './_test-helpers'

describe('PdfDocumentImportStrategy', () => {
  it('matches PDF files and delegates markdown extraction', async () => {
    const pdfMarkdownExtractionService = {
      extractMarkdown: vi.fn().mockResolvedValue('pdf text')
    }
    const strategy = new PdfDocumentImportStrategy(
      pdfMarkdownExtractionService as unknown as PdfMarkdownExtractionService,
      new MimeTypeService(),
      new FileExtensionService()
    )

    const file = createTextFile('content', 'file.pdf', 'application/pdf')
    expect(strategy.canRead(file)).toBe(true)
    await expect(strategy.read(file)).resolves.toBe('pdf text')
    expect(pdfMarkdownExtractionService.extractMarkdown).toHaveBeenCalledTimes(1)
  })
})
