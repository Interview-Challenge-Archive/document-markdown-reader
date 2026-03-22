import { Service } from '@freshgum/typedi'
import { InvalidPagesError } from '../errors/InvalidPagesError'
import { UnreadablePagesError } from '../errors/UnreadablePagesError'
import { FileExtensionService } from '../services/FileExtensionService'
import { MarkdownItService } from '../services/MarkdownItService'
import { MimeTypeService } from '../services/MimeTypeService'
import { PdfMarkdownExtractionService } from '../services/PdfMarkdownExtractionService'
import { ZipArchiveService } from '../services/ZipArchiveService'
import type { DocumentFileLike } from '../types/DocumentFileLike'
import { DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, DocumentImportStrategy } from './DocumentImportStrategy'

type ZipEntry = {
  async(type: 'string' | 'arraybuffer'): Promise<string | ArrayBuffer>
}

@Service(
  { id: DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, multiple: true },
  [
    PdfMarkdownExtractionService.SERVICE_ID,
    MimeTypeService.SERVICE_ID,
    FileExtensionService.SERVICE_ID,
    MarkdownItService.SERVICE_ID,
    ZipArchiveService.SERVICE_ID
  ]
)
export class PagesDocumentImportStrategy extends DocumentImportStrategy {
  constructor(
    private readonly pdfMarkdownExtractionService: PdfMarkdownExtractionService,
    private readonly mimeTypeService: MimeTypeService,
    private readonly fileExtensionService: FileExtensionService,
    private readonly markdownItService: MarkdownItService,
    private readonly zipArchiveService: ZipArchiveService
  ) {
    super()
  }

  readonly name = 'Apple Pages'
  readonly supportedMimeTypes = [
    'application/vnd.apple.pages',
    'application/x-iwork-pages-sffpages'
  ]

  readonly supportedExtensions = ['pages']

  canRead(file: DocumentFileLike): boolean {
    return this.mimeTypeService.matchesMimeType(file, this.supportedMimeTypes)
      || this.fileExtensionService.matchesFileExtension(file, this.supportedExtensions)
  }

  /**
   * @throws {InvalidPagesError} When the Pages file is not a valid archive
   * @throws {UnreadablePagesError} When no readable content can be extracted from the Pages file
   */
  async read(file: DocumentFileLike): Promise<string> {
    const pagesArrayBuffer = await file.arrayBuffer()

    if (!this.zipArchiveService.looksLikeZipArchive(pagesArrayBuffer)) {
      throw new InvalidPagesError()
    }

    const archive = await this.zipArchiveService.loadArchive(pagesArrayBuffer)

    const indexXmlFile = this.firstZipEntry(archive.file(/^index\.xml$/i))
      ?? this.firstZipEntry(archive.file(/^Index\/index\.xml$/i))

    if (indexXmlFile) {
      const indexXmlText = this.extractTextFromXml(await indexXmlFile.async('string') as string)

      if (indexXmlText) {
        return this.markdownItService.plainTextToMarkdown(indexXmlText)
      }
    }

    const previewPdfFile = this.firstZipEntry(archive.file(/^QuickLook\/Preview\.pdf$/i))

    if (previewPdfFile) {
      const previewPdfArrayBuffer = await previewPdfFile.async('arraybuffer') as ArrayBuffer
      const previewPdfText = await this.pdfMarkdownExtractionService.extractMarkdown(previewPdfArrayBuffer)

      if (previewPdfText) {
        return previewPdfText
      }
    }

    const textFiles = this.toZipEntryArray(archive.file(/\.txt$/i))

    if (textFiles.length) {
      const textContent = (await Promise.all(textFiles.map(async (item) => await item.async('string'))))
        .map((value) => String(value ?? '').trim())
        .filter(Boolean)
        .join('\n\n')

      if (textContent) {
        return this.markdownItService.plainTextToMarkdown(textContent)
      }
    }

    throw new UnreadablePagesError()
  }

  private extractTextFromXml(xmlValue: string): string {
    const normalizedXmlValue = String(xmlValue ?? '').trim()

    if (!normalizedXmlValue) {
      return ''
    }

    if (typeof DOMParser === 'undefined') {
      return normalizedXmlValue
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    }

    const parser = new DOMParser()
    const xmlDocument = parser.parseFromString(normalizedXmlValue, 'application/xml')

    if (xmlDocument.querySelector('parsererror')) {
      return ''
    }

    return String(xmlDocument.documentElement?.textContent ?? '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private firstZipEntry(value: unknown): ZipEntry | null {
    if (Array.isArray(value)) {
      return this.firstZipEntry(value[0])
    }

    if (!value) {
      return null
    }

    const candidate = value as ZipEntry
    return typeof candidate.async === 'function'
      ? candidate
      : null
  }

  private toZipEntryArray(value: unknown): ZipEntry[] {
    if (!value) {
      return []
    }

    if (!Array.isArray(value)) {
      const singleEntry = this.firstZipEntry(value)
      return singleEntry
        ? [singleEntry]
        : []
    }

    return value
      .map((entry) => this.firstZipEntry(entry))
      .filter((entry): entry is ZipEntry => Boolean(entry))
  }
}
