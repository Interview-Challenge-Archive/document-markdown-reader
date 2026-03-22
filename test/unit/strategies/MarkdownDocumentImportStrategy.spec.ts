import { describe, expect, it } from 'vitest'
import { FileExtensionService } from '../../../src/services/FileExtensionService'
import { MimeTypeService } from '../../../src/services/MimeTypeService'
import { MarkdownDocumentImportStrategy } from '../../../src/strategies/MarkdownDocumentImportStrategy'
import { createTextFile } from './_test-helpers'

describe('MarkdownDocumentImportStrategy', () => {
  it('matches by markdown mime type or extension and returns source text', async () => {
    const strategy = new MarkdownDocumentImportStrategy(new MimeTypeService(), new FileExtensionService())
    const markdownFile = createTextFile('## Heading', 'notes.md', 'text/markdown')

    expect(strategy.canRead(createTextFile('text', 'notes.x', 'text/x-markdown'))).toBe(true)
    expect(strategy.canRead(createTextFile('text', 'notes.mdx', 'application/octet-stream'))).toBe(true)
    expect(strategy.canRead(createTextFile('text', 'notes.txt', 'text/plain'))).toBe(false)
    await expect(strategy.read(markdownFile)).resolves.toBe('## Heading')
  })
})
