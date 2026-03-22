import { describe, expect, it, vi } from 'vitest'
import { FileExtensionService } from '../../../src/services/FileExtensionService'
import type { MarkdownItService } from '../../../src/services/MarkdownItService'
import { MimeTypeService } from '../../../src/services/MimeTypeService'
import { HtmlDocumentImportStrategy } from '../../../src/strategies/HtmlDocumentImportStrategy'
import { createTextFile } from './_test-helpers'

describe('HtmlDocumentImportStrategy', () => {
  it('matches html sources and converts html to markdown', async () => {
    const markdownItService = {
      htmlToMarkdown: vi.fn().mockReturnValue('# Converted')
    }
    const strategy = new HtmlDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService
    )

    expect(strategy.canRead(createTextFile('<p>t</p>', 'notes.htm', 'application/octet-stream'))).toBe(true)
    expect(strategy.canRead(createTextFile('<p>t</p>', 'notes.bin', 'application/xhtml+xml'))).toBe(true)
    expect(strategy.canRead(createTextFile('<p>t</p>', 'notes.txt', 'text/plain'))).toBe(false)
    await expect(strategy.read(createTextFile('<h1>Title</h1>', 'notes.html', 'text/html'))).resolves.toBe(
      '# Converted'
    )
    expect(markdownItService.htmlToMarkdown).toHaveBeenCalledWith('<h1>Title</h1>')
  })
})
