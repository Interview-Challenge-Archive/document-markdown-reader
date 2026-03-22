import type { DocumentFileLike } from '../types/DocumentFileLike'
import { Service } from '@freshgum/typedi'
import { FileExtensionService } from '../services/FileExtensionService'
import { MarkdownItService } from '../services/MarkdownItService'
import { MimeTypeService } from '../services/MimeTypeService'
import { RtfToHtmlService } from '../services/RtfToHtmlService'
import { DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, DocumentImportStrategy } from './DocumentImportStrategy'

@Service(
  { id: DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, multiple: true },
  [
    MimeTypeService.SERVICE_ID,
    FileExtensionService.SERVICE_ID,
    MarkdownItService.SERVICE_ID,
    RtfToHtmlService.SERVICE_ID
  ]
)
export class RtfDocumentImportStrategy extends DocumentImportStrategy {
  constructor(
    private readonly mimeTypeService: MimeTypeService,
    private readonly fileExtensionService: FileExtensionService,
    private readonly markdownItService: MarkdownItService,
    private readonly rtfToHtmlService: RtfToHtmlService
  ) {
    super()
  }

  readonly name = 'Rich Text Format'
  readonly supportedMimeTypes = [
    'application/rtf',
    'text/rtf',
    'application/x-rtf'
  ]

  readonly supportedExtensions = ['rtf']

  canRead(file: DocumentFileLike): boolean {
    return this.mimeTypeService.matchesMimeType(file, this.supportedMimeTypes)
      || this.fileExtensionService.matchesFileExtension(file, this.supportedExtensions)
  }

  async read(file: DocumentFileLike): Promise<string> {
    const rtfContent = await file.text()

    try {
      const htmlContent = await this.rtfToHtmlService.convertToHtml(rtfContent)

      if (htmlContent) {
        return this.markdownItService.htmlToMarkdown(htmlContent)
      }
    } catch {
      // fallback to plain text parser below
    }

    return this.markdownItService.plainTextToMarkdown(this.parseRtfToPlainText(rtfContent))
  }

  private parseRtfToPlainText(rtfContent: string | null | undefined): string {
    const normalizedContent = String(rtfContent ?? '')
      .replace(/\r\n?/g, '\n')
      .replace(/\{\\fonttbl[\s\S]*?\}/gi, '')
      .replace(/\{\\colortbl[\s\S]*?\}/gi, '')
      .replace(/\{\\stylesheet[\s\S]*?\}/gi, '')
      .replace(/\\par[d]?/g, '\n')
      .replace(/\\line/g, '\n')
      .replace(/\\tab/g, '\t')
      .replace(/\\u-?\d+\??/g, '')
      .replace(/\\'[0-9a-fA-F]{2}/g, (match) => String.fromCharCode(Number.parseInt(match.slice(2), 16)))
      .replace(/\\([{}\\])/g, '$1')
      .replace(/\\[a-z]+-?\d* ?/gi, '')
      .replace(/[{}]/g, '')
      .replace(/\n{3,}/g, '\n\n')

    return normalizedContent.trim()
  }
}
