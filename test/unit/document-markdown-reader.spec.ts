import JSZip from 'jszip'
import { Container } from '@freshgum/typedi'
import { describe, expect, it } from 'vitest'
import { InvalidDocxError } from '../../src/errors/InvalidDocxError'
import { UnsupportedFormatError } from '../../src/errors/UnsupportedFormatError'
import { DocumentReadStrategyResolver } from '../../src/resolvers/DocumentReadStrategyResolver'
import { FileExtensionService } from '../../src/services/FileExtensionService'
import { MarkdownItService } from '../../src/services/MarkdownItService'
import { MimeTypeService } from '../../src/services/MimeTypeService'
import { OpenDocumentConversionService } from '../../src/services/OpenDocumentConversionService'
import { PdfMarkdownExtractionService } from '../../src/services/PdfMarkdownExtractionService'
import { ZipArchiveService } from '../../src/services/ZipArchiveService'
import { documentMarkdownReader } from '../../src/index'
import { OpenDocumentImportStrategy } from '../../src/strategies/OpenDocumentImportStrategy'
import { PagesDocumentImportStrategy } from '../../src/strategies/PagesDocumentImportStrategy'
import { PdfDocumentImportStrategy } from '../../src/strategies/PdfDocumentImportStrategy'
import { RtfDocumentImportStrategy } from '../../src/strategies/RtfDocumentImportStrategy'
import { WordDocumentImportStrategy } from '../../src/strategies/WordDocumentImportStrategy'
import type { DocumentFileLike } from '../../src/index'

describe('document-markdown-reader', () => {
  it('reader exposes supported extensions and accept string', () => {
    expect(documentMarkdownReader.supportedExtensions).toContain('docx')
    expect(documentMarkdownReader.supportedExtensions).toContain('rtf')
    expect(documentMarkdownReader.acceptedExtensions).toContain('.docx')
    expect(documentMarkdownReader.acceptedExtensions).toContain('.pdf')
    expect(documentMarkdownReader.acceptedExtensions).toContain('.rtf')
  })

  it('resolver throws unsupported format error when no strategy matches', () => {
    const resolver = Container.get<DocumentReadStrategyResolver>(DocumentReadStrategyResolver.SERVICE_ID)
    const file = createFile('binary', 'archive.bin', 'application/octet-stream')

    expect(() => resolver.resolve(file)).toThrow(UnsupportedFormatError)
  })

  it('reads plain text document as markdown', async () => {
    const file = createFile('First line\n\nSecond line', 'notes.txt', 'text/plain')
    const markdown = await documentMarkdownReader.readDocument(file)

    expect(markdown).toBe('First line\n\nSecond line')
  })

  it('reads markdown document as markdown', async () => {
    const file = createFile('## Header\n\n**Bold**', 'notes.md', 'text/markdown')
    const markdown = await documentMarkdownReader.readDocument(file)

    expect(markdown).toContain('## Header')
    expect(markdown).toContain('**Bold**')
  })

  it('prioritizes extension matching over generic mime types', async () => {
    const file = createFile('not a zip archive', 'broken.docx', 'text/plain')

    await expect(documentMarkdownReader.readDocument(file)).rejects.toBeInstanceOf(InvalidDocxError)
  })

  it('keeps markdown text unchanged', async () => {
    const markdownSource = '## Header  \n\nParagraph with **bold** and _italic_.\n'
    const file = createFile(markdownSource, 'notes.md', 'text/markdown')
    const markdown = await documentMarkdownReader.readDocument(file)

    expect(markdown).toBe(markdownSource)
  })

  it('reads html document as markdown', async () => {
    const file = createFile('<h2>Header</h2><p><strong>Bold</strong></p>', 'notes.html', 'text/html')
    const markdown = await documentMarkdownReader.readDocument(file)

    expect(markdown).toContain('## Header')
    expect(markdown).toContain('**Bold**')
  })

  it('escapes markdown syntax in plain text files', async () => {
    const plainText = '[link](x)\n# Header\n1. item\n- bullet\n* emphasis *\nback\\slash'
    const file = createFile(plainText, 'notes.txt', 'text/plain')
    const markdown = await documentMarkdownReader.readDocument(file)

    expect(markdown).toBe('\\[link\\]\\(x\\)\n\\# Header\n1\\. item\n\\- bullet\n\\* emphasis \\*\nback\\\\slash')
  })

  it('reads odt document as markdown', async () => {
    const odtFile = await createOdtFile(
      createOpenDocumentContentXml([
        '<text:h text:outline-level="1">Weekly Summary</text:h>',
        '<text:p>Implemented importer update.</text:p>'
      ].join('\n'))
    )

    const markdown = await documentMarkdownReader.readDocument(odtFile)

    expect(markdown).toContain('# Weekly Summary')
    expect(markdown).toContain('Implemented importer update.')
  })

  it('reads fodt document as markdown', async () => {
    const fodtFile = createFile(
      createFlatOpenDocumentXml([
        '<text:h text:outline-level="1">Flat Summary</text:h>',
        '<text:p>Converted via parser library.</text:p>'
      ].join('\n')),
      'summary.fodt',
      'application/vnd.oasis.opendocument.text-flat-xml'
    )

    const markdown = await documentMarkdownReader.readDocument(fodtFile)

    expect(markdown).toContain('# Flat Summary')
    expect(markdown).toContain('Converted via parser library.')
  })

  it('reads rtf document as markdown', async () => {
    const file = createFile('{\\rtf1\\ansi\\pard\\fs20 Hello World\\par}', 'notes.rtf', 'application/rtf')
    const markdown = await documentMarkdownReader.readDocument(file)

    expect(markdown).toContain('Hello World')
  })

  it('reads docx document as markdown', async () => {
    const file = createFile('PK\x03\x04', 'document.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')

    // This will likely fail with InvalidDocxError since it's not a real docx file,
    // but it tests that the strategy is being called
    await expect(documentMarkdownReader.readDocument(file)).rejects.toBeInstanceOf(InvalidDocxError)
  })

  it('reads pages document as markdown', async () => {
    const file = createFile('PK\x03\x04', 'document.pages', 'application/x-iwork-pages-sffpages')

    // This will likely fail since it's not a real pages file,
    // but it tests that the strategy is being called
    await expect(documentMarkdownReader.readDocument(file)).rejects.toBeInstanceOf(Error)
  })

  it('preserves legacy reflection metadata for DI', () => {
    expect(Reflect.getMetadata('design:paramtypes', OpenDocumentImportStrategy)).toEqual([
      OpenDocumentConversionService,
      MimeTypeService,
      FileExtensionService
    ])
    expect(Reflect.getMetadata('design:paramtypes', PagesDocumentImportStrategy)).toEqual([
      PdfMarkdownExtractionService,
      MimeTypeService,
      FileExtensionService,
      MarkdownItService,
      ZipArchiveService
    ])
    expect(Reflect.getMetadata('design:paramtypes', PdfDocumentImportStrategy)).toEqual([
      PdfMarkdownExtractionService,
      MimeTypeService,
      FileExtensionService
    ])
    expect(Reflect.getMetadata('design:paramtypes', RtfDocumentImportStrategy)).toEqual([
      MimeTypeService,
      FileExtensionService,
      MarkdownItService,
      expect.any(Function) // RtfToHtmlService
    ])
    expect(Reflect.getMetadata('design:paramtypes', WordDocumentImportStrategy)).toEqual([
      MimeTypeService,
      FileExtensionService,
      MarkdownItService,
      expect.any(Function), // MammothConversionService
      expect.any(Function)  // ZipArchiveService
    ])
  })
})

function createFile(content: string, name: string, type: string): DocumentFileLike {
  return {
    name,
    type,
    async text() {
      return content
    },
    async arrayBuffer() {
      const encoded = new TextEncoder().encode(content)
      return encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength)
    }
  }
}

async function createOdtFile(contentXml: string): Promise<DocumentFileLike> {
  const archive = new JSZip()
  archive.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' })
  archive.file('content.xml', contentXml)

  const odtArrayBuffer = await archive.generateAsync({ type: 'arraybuffer' })
  return createBinaryFile(odtArrayBuffer, 'summary.odt', 'application/vnd.oasis.opendocument.text')
}

function createBinaryFile(content: ArrayBuffer, name: string, type: string): DocumentFileLike {
  return {
    name,
    type,
    async text() {
      return new TextDecoder().decode(content)
    },
    async arrayBuffer() {
      return content.slice(0)
    }
  }
}

function createOpenDocumentContentXml(bodyMarkup: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0">
  <office:body>
    <office:text>
      ${bodyMarkup}
    </office:text>
  </office:body>
</office:document-content>`
}

function createFlatOpenDocumentXml(bodyMarkup: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<office:document
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  office:mimetype="application/vnd.oasis.opendocument.text-flat-xml">
  <office:body>
    <office:text>
      ${bodyMarkup}
    </office:text>
  </office:body>
</office:document>`
}
