import { Service } from '@freshgum/typedi'
import type { DocumentFileLike } from '../../types/DocumentFileLike'
import { FileExtensionService } from '../../services/FileExtensionService'
import { MarkdownItService } from '../../services/MarkdownItService'
import { MimeTypeService } from '../../services/MimeTypeService'
import { DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, DocumentImportStrategy } from './DocumentImportStrategy'

@Service(
  { id: DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, multiple: true },
  [MimeTypeService.SERVICE_ID, FileExtensionService.SERVICE_ID, MarkdownItService.SERVICE_ID]
)
export class HtmlDocumentImportStrategy extends DocumentImportStrategy {
  constructor(
    private readonly mimeTypeService: MimeTypeService,
    private readonly fileExtensionService: FileExtensionService,
    private readonly markdownItService: MarkdownItService
  ) {
    super()
  }

  readonly name = 'HTML'
  readonly supportedMimeTypes = ['text/html', 'application/xhtml+xml']

  readonly supportedExtensions = ['html', 'htm']

  canRead(file: DocumentFileLike): boolean {
    return this.mimeTypeService.matchesMimeType(file, this.supportedMimeTypes)
      || this.fileExtensionService.matchesFileExtension(file, this.supportedExtensions)
  }

  async read(file: DocumentFileLike): Promise<string> {
    return this.markdownItService.htmlToMarkdown(await file.text())
  }
}
