import type { DocumentFileLike } from '../types/DocumentFileLike'

export const DOCUMENT_IMPORT_STRATEGY_SERVICE_ID = 'document-import-strategy'

export abstract class DocumentImportStrategy {
  static readonly SERVICE_ID = DOCUMENT_IMPORT_STRATEGY_SERVICE_ID

  abstract readonly name: string
  abstract readonly supportedMimeTypes: ReadonlyArray<string>
  abstract readonly supportedExtensions: ReadonlyArray<string>
  abstract canRead(file: DocumentFileLike): boolean
  /**
   * @throws {DocumentImportError} Base class for all document import errors
   * @throws {InvalidDocxError} When the DOCX file is invalid or corrupted
   * @throws {InvalidOdtError} When the ODT file is invalid or corrupted
   * @throws {InvalidPagesError} When the Pages file is invalid or corrupted
   * @throws {InvalidPdfError} When the PDF file is invalid or corrupted
   * @throws {UnreadableDocError} When the DOC file content cannot be read
   * @throws {UnreadablePagesError} When the Pages file content cannot be read
   * @throws {UnreadablePdfError} When the PDF file content cannot be read
   */
  abstract read(file: DocumentFileLike): Promise<string>
}
