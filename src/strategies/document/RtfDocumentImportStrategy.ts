import type { DocumentFileLike } from '../../types/DocumentFileLike'
import { Service } from '@freshgum/typedi'
import { FileExtensionService } from '../../services/FileExtensionService'
import { MarkdownItService } from '../../services/MarkdownItService'
import { MimeTypeService } from '../../services/MimeTypeService'
import { RtfToHtmlService } from '../../services/RtfToHtmlService'
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
    const rtfArrayBuffer = await file.arrayBuffer()
    const htmlContent = await this.rtfToHtmlService.convertToHtml(new Uint8Array(rtfArrayBuffer))

    return this.markdownItService.htmlToMarkdown(htmlContent)
  }
}
