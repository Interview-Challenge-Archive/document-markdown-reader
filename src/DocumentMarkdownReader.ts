import type { ContainerInstance } from '@freshgum/typedi'
import { DocumentReadStrategyResolver } from './resolvers/DocumentReadStrategyResolver'
import type { SupportedFormat } from './resolvers/DocumentReadStrategyResolver'
import type { DocumentFileLike } from './types/DocumentFileLike'
import type { DocumentReadOptions } from './types/DocumentReadOptions'

export class DocumentMarkdownReader {
  constructor(private readonly container: ContainerInstance) {}

  private get resolver(): DocumentReadStrategyResolver {
    return this.container.get<DocumentReadStrategyResolver>(
      DocumentReadStrategyResolver.SERVICE_ID
    )
  }

  get supportedExtensions(): ReadonlyArray<string> {
    return this.resolver.supportedExtensions
  }

  get supportedFormats(): ReadonlyArray<SupportedFormat> {
    return this.resolver.supportedFormats
  }

  get acceptedExtensions(): string {
    return this.resolver.acceptedExtensions
  }

  /**
   * @throws {UnsupportedFormatError} When the file format is not supported
   * @throws {InvalidDocxError} When the DOCX file is invalid or corrupted
   * @throws {InvalidOdtError} When the ODT file is invalid or corrupted
   * @throws {InvalidPagesError} When the Pages file is invalid or corrupted
   * @throws {InvalidPdfError} When the PDF file is invalid or corrupted
   * @throws {UnreadableDocError} When the DOC file content cannot be read
   * @throws {UnreadablePagesError} When the Pages file content cannot be read
   * @throws {UnreadablePdfError} When the PDF file content cannot be read
   */
  async readDocument(file: DocumentFileLike, options?: DocumentReadOptions): Promise<string> {
    const importStrategy = this.resolver.resolve(file)

    return await importStrategy.read(file, options)
  }
}
