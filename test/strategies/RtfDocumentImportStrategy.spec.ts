import { describe, expect, it, vi } from 'vitest'
import { FileExtensionService } from '../../src/services/FileExtensionService'
import type { MarkdownItService } from '../../src/services/MarkdownItService'
import { MimeTypeService } from '../../src/services/MimeTypeService'
import type { RtfToHtmlService } from '../../src/services/RtfToHtmlService'
import { RtfDocumentImportStrategy } from '../../src/strategies/RtfDocumentImportStrategy'
import { createTextFile } from './_test-helpers'

describe('RtfDocumentImportStrategy', () => {
  it('converts rtf to html and then markdown when converter succeeds', async () => {
    const markdownItService = {
      htmlToMarkdown: vi.fn().mockReturnValue('from-html'),
      plainTextToMarkdown: vi.fn()
    }
    const rtfToHtmlService = {
      convertToHtml: vi.fn().mockResolvedValue('<p>Hello</p>')
    }
    const strategy = new RtfDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService,
      rtfToHtmlService as unknown as RtfToHtmlService
    )

    await expect(strategy.read(createTextFile('{\\rtf1 Hello}', 'notes.rtf', 'application/rtf'))).resolves.toBe(
      'from-html'
    )
    expect(markdownItService.htmlToMarkdown).toHaveBeenCalledWith('<p>Hello</p>')
    expect(markdownItService.plainTextToMarkdown).not.toHaveBeenCalled()
  })

  it('throws when html conversion fails', async () => {
    const markdownItService = {
      htmlToMarkdown: vi.fn(),
      plainTextToMarkdown: vi.fn()
    }
    const rtfToHtmlService = {
      convertToHtml: vi.fn().mockRejectedValue(new Error('failed'))
    }
    const strategy = new RtfDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService,
      rtfToHtmlService as unknown as RtfToHtmlService
    )

    await expect(strategy.read(createTextFile('{\\rtf1\\ansi Hello\\par}', 'notes.rtf', 'text/rtf'))).rejects.toThrow(
      'failed'
    )
    expect(markdownItService.htmlToMarkdown).not.toHaveBeenCalled()
    expect(markdownItService.plainTextToMarkdown).not.toHaveBeenCalled()
  })
})
