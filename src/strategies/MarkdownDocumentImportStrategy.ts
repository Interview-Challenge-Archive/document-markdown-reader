import { Service } from '@freshgum/typedi'
import type { DocumentFileLike } from '../types/DocumentFileLike'
import { FileExtensionService } from '../services/FileExtensionService'
import { MimeTypeService } from '../services/MimeTypeService'
import { DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, DocumentImportStrategy } from './DocumentImportStrategy'

@Service(
  { id: DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, multiple: true },
  [MimeTypeService.SERVICE_ID, FileExtensionService.SERVICE_ID]
)
export class MarkdownDocumentImportStrategy extends DocumentImportStrategy {
  constructor(
    private readonly mimeTypeService: MimeTypeService,
    private readonly fileExtensionService: FileExtensionService
  ) {
    super()
  }

  readonly name = 'Markdown'
  readonly supportedMimeTypes = [
    'text/markdown',
    'text/x-markdown',
    'text/mdx',
    'text/x-mdx'
  ]

  readonly supportedExtensions = ['md', 'markdown', 'mdx']

  canRead(file: DocumentFileLike): boolean {
    return this.mimeTypeService.matchesMimeType(file, this.supportedMimeTypes)
      || this.fileExtensionService.matchesFileExtension(file, this.supportedExtensions)
  }

  async read(file: DocumentFileLike): Promise<string> {
    return await file.text()
  }
}
