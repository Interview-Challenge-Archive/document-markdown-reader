import { describe, expect, it, vi } from 'vitest'
import { InvalidPagesError } from '../../../src/errors/InvalidPagesError'
import { UnreadablePagesError } from '../../../src/errors/UnreadablePagesError'
import { FileExtensionService } from '../../../src/services/FileExtensionService'
import type { MarkdownItService } from '../../../src/services/MarkdownItService'
import { MimeTypeService } from '../../../src/services/MimeTypeService'
import type { PdfMarkdownExtractionService } from '../../../src/services/PdfMarkdownExtractionService'
import type { ZipArchiveService } from '../../../src/services/ZipArchiveService'
import { PagesDocumentImportStrategy } from '../../../src/strategies/PagesDocumentImportStrategy'
import { createTextFile, createZipArchive } from './_test-helpers'

describe('PagesDocumentImportStrategy', () => {
  it('throws InvalidPagesError when file is not a zip archive', async () => {
    const strategy = new PagesDocumentImportStrategy(
      { extractMarkdown: vi.fn() } as unknown as PdfMarkdownExtractionService,
      new MimeTypeService(),
      new FileExtensionService(),
      { plainTextToMarkdown: vi.fn() } as unknown as MarkdownItService,
      {
        looksLikeZipArchive: vi.fn().mockReturnValue(false),
        loadArchive: vi.fn()
      } as unknown as ZipArchiveService
    )

    await expect(strategy.read(createTextFile('x', 'doc.pages', 'application/vnd.apple.pages'))).rejects.toBeInstanceOf(
      InvalidPagesError
    )
  })

  it('reads index.xml content when available', async () => {
    const markdownItService = {
      plainTextToMarkdown: vi.fn().mockReturnValue('from-index')
    }
    const archive = createZipArchive({
      'index.xml': {
        async: vi.fn(async () => '<root>Hello <b>World</b></root>')
      }
    })
    const strategy = new PagesDocumentImportStrategy(
      { extractMarkdown: vi.fn() } as unknown as PdfMarkdownExtractionService,
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService,
      {
        looksLikeZipArchive: vi.fn().mockReturnValue(true),
        loadArchive: vi.fn().mockResolvedValue(archive)
      } as unknown as ZipArchiveService
    )

    await expect(strategy.read(createTextFile('x', 'doc.pages', 'application/vnd.apple.pages'))).resolves.toBe(
      'from-index'
    )
    expect(markdownItService.plainTextToMarkdown).toHaveBeenCalledWith('Hello World')
  })

  it('falls back to preview PDF extraction when index.xml is missing', async () => {
    const previewBuffer = new Uint8Array([1, 2, 3]).buffer
    const pdfMarkdownExtractionService = {
      extractMarkdown: vi.fn().mockResolvedValue('from-preview')
    }
    const archive = createZipArchive({
      'QuickLook/Preview.pdf': {
        async: vi.fn(async (type) => type === 'arraybuffer' ? previewBuffer : '')
      }
    })
    const strategy = new PagesDocumentImportStrategy(
      pdfMarkdownExtractionService as unknown as PdfMarkdownExtractionService,
      new MimeTypeService(),
      new FileExtensionService(),
      { plainTextToMarkdown: vi.fn() } as unknown as MarkdownItService,
      {
        looksLikeZipArchive: vi.fn().mockReturnValue(true),
        loadArchive: vi.fn().mockResolvedValue(archive)
      } as unknown as ZipArchiveService
    )

    await expect(strategy.read(createTextFile('x', 'doc.pages', 'application/vnd.apple.pages'))).resolves.toBe(
      'from-preview'
    )
    expect(pdfMarkdownExtractionService.extractMarkdown).toHaveBeenCalledWith(previewBuffer)
  })

  it('falls back to text files when index.xml and preview PDF are missing', async () => {
    const markdownItService = {
      plainTextToMarkdown: vi.fn().mockReturnValue('from-text')
    }
    const archive = createZipArchive({
      'preview/part1.txt': {
        async: vi.fn(async () => ' First ')
      },
      'preview/part2.txt': {
        async: vi.fn(async () => 'Second')
      }
    })
    const strategy = new PagesDocumentImportStrategy(
      { extractMarkdown: vi.fn() } as unknown as PdfMarkdownExtractionService,
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService,
      {
        looksLikeZipArchive: vi.fn().mockReturnValue(true),
        loadArchive: vi.fn().mockResolvedValue(archive)
      } as unknown as ZipArchiveService
    )

    await expect(strategy.read(createTextFile('x', 'doc.pages', 'application/vnd.apple.pages'))).resolves.toBe(
      'from-text'
    )
    expect(markdownItService.plainTextToMarkdown).toHaveBeenCalledWith('First\n\nSecond')
  })

  it('throws UnreadablePagesError when no readable content exists', async () => {
    const archive = createZipArchive({})
    const strategy = new PagesDocumentImportStrategy(
      { extractMarkdown: vi.fn().mockResolvedValue('') } as unknown as PdfMarkdownExtractionService,
      new MimeTypeService(),
      new FileExtensionService(),
      { plainTextToMarkdown: vi.fn() } as unknown as MarkdownItService,
      {
        looksLikeZipArchive: vi.fn().mockReturnValue(true),
        loadArchive: vi.fn().mockResolvedValue(archive)
      } as unknown as ZipArchiveService
    )

    await expect(strategy.read(createTextFile('x', 'doc.pages', 'application/vnd.apple.pages'))).rejects.toBeInstanceOf(
      UnreadablePagesError
    )
  })
})
