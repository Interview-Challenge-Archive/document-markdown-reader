import { describe, expect, it, vi } from 'vitest'
import { InvalidDocxError } from '../../../src/errors/InvalidDocxError'
import { UnreadableDocError } from '../../../src/errors/UnreadableDocError'
import { FileExtensionService } from '../../../src/services/FileExtensionService'
import type { MammothConversionService } from '../../../src/services/MammothConversionService'
import type { MarkdownItService } from '../../../src/services/MarkdownItService'
import { MimeTypeService } from '../../../src/services/MimeTypeService'
import type { ZipArchiveService } from '../../../src/services/ZipArchiveService'
import { DataUrlImageStoringStrategy } from '../../../src/strategies/images/DataUrlImageStoringStrategy'
import type { ImageStoringStrategy } from '../../../src/strategies/images/ImageStoringStrategy'
import { WordDocumentImportStrategy } from '../../../src/strategies/document/WordDocumentImportStrategy'
import { createBinaryFile, createTextFile } from './_test-helpers'

describe('WordDocumentImportStrategy', () => {
  it('uses mammoth for docx/docm and converts returned html to markdown', async () => {
    const markdownItService = {
      htmlToMarkdown: vi.fn().mockReturnValue('# Docx'),
      plainTextToMarkdown: vi.fn()
    }
    const mammothConversionService = {
      convertToHtml: vi.fn().mockResolvedValue('<h1>Docx</h1>')
    }
    const zipArchiveService = {
      looksLikeZipArchive: vi.fn().mockReturnValue(false)
    }
    const strategy = new WordDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService,
      mammothConversionService as unknown as MammothConversionService,
      zipArchiveService as unknown as ZipArchiveService
    )

    await expect(
      strategy.read(createTextFile('ignored', 'file.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
    ).resolves.toBe('# Docx')
    expect(mammothConversionService.convertToHtml).toHaveBeenCalledTimes(1)
    expect(markdownItService.htmlToMarkdown).toHaveBeenCalledWith('<h1>Docx</h1>')
  })

  it('throws InvalidDocxError when docx/docm conversion fails', async () => {
    const strategy = new WordDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      { htmlToMarkdown: vi.fn(), plainTextToMarkdown: vi.fn() } as unknown as MarkdownItService,
      { convertToHtml: vi.fn().mockRejectedValue(new Error('broken')) } as unknown as MammothConversionService,
      { looksLikeZipArchive: vi.fn().mockReturnValue(false) } as unknown as ZipArchiveService
    )

    await expect(strategy.read(createTextFile('x', 'broken.docx', 'text/plain'))).rejects.toBeInstanceOf(
      InvalidDocxError
    )
  })

  it('falls back to binary text extraction for legacy doc files', async () => {
    const markdownItService = {
      htmlToMarkdown: vi.fn(),
      plainTextToMarkdown: vi.fn().mockReturnValue('plain-markdown')
    }
    const strategy = new WordDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService,
      { convertToHtml: vi.fn() } as unknown as MammothConversionService,
      { looksLikeZipArchive: vi.fn().mockReturnValue(false) } as unknown as ZipArchiveService
    )
    const binary = new Uint8Array([72, 101, 108, 108, 111, 0, 87, 111, 114, 108, 100]).buffer

    await expect(strategy.read(createBinaryFile(binary, 'legacy.doc', 'application/msword'))).resolves.toBe(
      'plain-markdown'
    )
    expect(markdownItService.plainTextToMarkdown).toHaveBeenCalledWith('Hello World')
  })

  it('throws UnreadableDocError when extracted binary text is empty', async () => {
    const strategy = new WordDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      { htmlToMarkdown: vi.fn(), plainTextToMarkdown: vi.fn() } as unknown as MarkdownItService,
      { convertToHtml: vi.fn() } as unknown as MammothConversionService,
      { looksLikeZipArchive: vi.fn().mockReturnValue(false) } as unknown as ZipArchiveService
    )
    const binary = new Uint8Array([0, 1, 2, 3]).buffer

    await expect(strategy.read(createBinaryFile(binary, 'legacy.doc', 'application/msword'))).rejects.toBeInstanceOf(
      UnreadableDocError
    )
  })

  it('passes image converter to mammoth when images option is provided', async () => {
    const markdownItService = {
      htmlToMarkdown: vi.fn().mockReturnValue('# Docx with image'),
      plainTextToMarkdown: vi.fn()
    }
    const mammothConversionService = {
      convertToHtml: vi.fn().mockResolvedValue('<h1>Docx with image</h1>')
    }
    const zipArchiveService = {
      looksLikeZipArchive: vi.fn().mockReturnValue(false)
    }
    const imageStoringStrategy: ImageStoringStrategy = {
      storeImage: vi.fn().mockResolvedValue('https://cdn.example.com/image.png')
    } as unknown as ImageStoringStrategy

    const strategy = new WordDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService,
      mammothConversionService as unknown as MammothConversionService,
      zipArchiveService as unknown as ZipArchiveService
    )

    await strategy.read(
      createTextFile('ignored', 'file.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
      { images: imageStoringStrategy }
    )

    expect(mammothConversionService.convertToHtml).toHaveBeenCalledWith(
      expect.any(ArrayBuffer),
      expect.any(Function)
    )
  })

  it('uses DataUrlImageStoringStrategy by default for docx images', async () => {
    const mammothConversionService = {
      convertToHtml: vi.fn().mockImplementation(
        async (_buffer: ArrayBuffer, imageConverter?: (buffer: ArrayBuffer, contentType: string) => Promise<string>) => {
          if (imageConverter) {
            const imageData = new TextEncoder().encode('fake-image-data').buffer
            const src = await imageConverter(imageData, 'image/png')
            return `<img src="${src}" />`
          }
          return ''
        }
      )
    }
    const markdownItService = {
      htmlToMarkdown: vi.fn().mockImplementation((html: string) => html),
      plainTextToMarkdown: vi.fn()
    }
    const zipArchiveService = {
      looksLikeZipArchive: vi.fn().mockReturnValue(false)
    }

    const strategy = new WordDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService,
      mammothConversionService as unknown as MammothConversionService,
      zipArchiveService as unknown as ZipArchiveService
    )

    const result = await strategy.read(
      createTextFile('ignored', 'file.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    )

    expect(result).toContain('data:image/png;base64,')
  })

  it('uses a custom image storing strategy when provided', async () => {
    const customSrc = 'https://cdn.example.com/custom-image.png'
    const mammothConversionService = {
      convertToHtml: vi.fn().mockImplementation(
        async (_buffer: ArrayBuffer, imageConverter?: (buffer: ArrayBuffer, contentType: string) => Promise<string>) => {
          if (imageConverter) {
            const imageData = new TextEncoder().encode('fake-image-data').buffer
            const src = await imageConverter(imageData, 'image/png')
            return `<img src="${src}" />`
          }
          return ''
        }
      )
    }
    const markdownItService = {
      htmlToMarkdown: vi.fn().mockImplementation((html: string) => html),
      plainTextToMarkdown: vi.fn()
    }
    const zipArchiveService = {
      looksLikeZipArchive: vi.fn().mockReturnValue(false)
    }

    const strategy = new WordDocumentImportStrategy(
      new MimeTypeService(),
      new FileExtensionService(),
      markdownItService as unknown as MarkdownItService,
      mammothConversionService as unknown as MammothConversionService,
      zipArchiveService as unknown as ZipArchiveService
    )

    const customImageStoringStrategy = new DataUrlImageStoringStrategy()
    vi.spyOn(customImageStoringStrategy, 'storeImage').mockResolvedValue(customSrc)

    const result = await strategy.read(
      createTextFile('ignored', 'file.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
      { images: customImageStoringStrategy }
    )

    expect(result).toContain(customSrc)
    expect(customImageStoringStrategy.storeImage).toHaveBeenCalledTimes(1)
  })
})
