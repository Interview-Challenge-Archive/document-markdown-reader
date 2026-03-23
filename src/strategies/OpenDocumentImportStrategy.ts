import { Service } from '@freshgum/typedi'
import { InvalidOdtError } from '../errors/InvalidOdtError'
import { FileExtensionService } from '../services/FileExtensionService'
import { MimeTypeService } from '../services/MimeTypeService'
import { OpenDocumentConversionService } from '../services/OpenDocumentConversionService'
import type { DocumentFileLike } from '../types/DocumentFileLike'
import { DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, DocumentImportStrategy } from './DocumentImportStrategy'

@Service(
  { id: DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, multiple: true },
  [
    OpenDocumentConversionService.SERVICE_ID,
    MimeTypeService.SERVICE_ID,
    FileExtensionService.SERVICE_ID
  ]
)
export class OpenDocumentImportStrategy extends DocumentImportStrategy {
  constructor(
    private readonly openDocumentConversionService: OpenDocumentConversionService,
    private readonly mimeTypeService: MimeTypeService,
    private readonly fileExtensionService: FileExtensionService
  ) {
    super()
  }

  readonly name = 'OpenDocument'
  readonly supportedMimeTypes = [
    'application/vnd.oasis.opendocument.text'
  ]

  readonly supportedExtensions = ['odt']

  canRead(file: DocumentFileLike): boolean {
    return this.mimeTypeService.matchesMimeType(file, this.supportedMimeTypes)
      || this.fileExtensionService.matchesFileExtension(file, this.supportedExtensions)
  }

  /**
   * @throws {InvalidOdtError} When the ODT file is invalid or corrupted
   */
  async read(file: DocumentFileLike): Promise<string> {
    try {
      return await this.openDocumentConversionService.convertOdtToMarkdown(await file.arrayBuffer())
    } catch {
      throw new InvalidOdtError()
    }
  }
}
