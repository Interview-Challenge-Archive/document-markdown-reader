import { Service } from '@freshgum/typedi'
import type { DocumentFileLike } from '../types/DocumentFileLike'
import { FileExtensionService } from '../services/FileExtensionService'
import { MimeTypeService } from '../services/MimeTypeService'
import { PdfMarkdownExtractionService } from '../services/PdfMarkdownExtractionService'
import { DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, DocumentImportStrategy } from './DocumentImportStrategy'

@Service(
  { id: DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, multiple: true },
  [
    PdfMarkdownExtractionService.SERVICE_ID,
    MimeTypeService.SERVICE_ID,
    FileExtensionService.SERVICE_ID
  ]
)
export class PdfDocumentImportStrategy extends DocumentImportStrategy {
  constructor(
    private readonly pdfMarkdownExtractionService: PdfMarkdownExtractionService,
    private readonly mimeTypeService: MimeTypeService,
    private readonly fileExtensionService: FileExtensionService
  ) {
    super()
  }

  readonly name = 'PDF'
  readonly supportedMimeTypes = ['application/pdf']

  readonly supportedExtensions = ['pdf']

  canRead(file: DocumentFileLike): boolean {
    return this.mimeTypeService.matchesMimeType(file, this.supportedMimeTypes)
      || this.fileExtensionService.matchesFileExtension(file, this.supportedExtensions)
  }

  /**
   * @throws {InvalidPdfError} When the PDF file is invalid or corrupted
   * @throws {UnreadablePdfError} When the PDF file content cannot be read
   */
  async read(file: DocumentFileLike): Promise<string> {
    return await this.pdfMarkdownExtractionService.extractMarkdown(await file.arrayBuffer())
  }
}
