import { describe, expect, it, vi } from 'vitest'
import { FileExtensionService } from '../../../src/services/FileExtensionService'
import type { MarkdownItService } from '../../../src/services/MarkdownItService'
import { MimeTypeService } from '../../../src/services/MimeTypeService'
import { PlainTextDocumentImportStrategy } from '../../../src/strategies/PlainTextDocumentImportStrategy'
import { createTextFile } from './_test-helpers'

describe('PlainTextDocumentImportStrategy', () => {
  it('matches by mime type or extension and converts to markdown', async () => {
    const markdownItService = {
      plainTextToMarkdown: vi.fn().mockReturnValue('converted')
    }
    const strategy = new PlainTextDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService
    )

    expect(strategy.canRead(createTextFile('text', 'notes.unknown', 'text/plain'))).toBe(true)
    expect(strategy.canRead(createTextFile('text', 'notes.txt', 'application/octet-stream'))).toBe(true)
    expect(strategy.canRead(createTextFile('text', 'notes.pdf', 'application/pdf'))).toBe(false)
    await expect(strategy.read(createTextFile('raw', 'notes.txt', 'text/plain'))).resolves.toBe('converted')
    expect(markdownItService.plainTextToMarkdown).toHaveBeenCalledWith('raw')
  })
})
