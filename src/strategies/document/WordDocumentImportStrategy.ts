import type { DocumentFileLike } from '../../types/DocumentFileLike'
import type { DocumentReadOptions } from '../../types/DocumentReadOptions'
import { Service } from '@freshgum/typedi'
import { InvalidDocxError } from '../../errors/InvalidDocxError'
import { UnreadableDocError } from '../../errors/UnreadableDocError'
import { FileExtensionService } from '../../services/FileExtensionService'
import { MarkdownItService } from '../../services/MarkdownItService'
import { MammothConversionService } from '../../services/MammothConversionService'
import { MimeTypeService } from '../../services/MimeTypeService'
import { ZipArchiveService } from '../../services/ZipArchiveService'
import { DataUrlImageStoringStrategy } from '../images/DataUrlImageStoringStrategy'
import { DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, DocumentImportStrategy } from './DocumentImportStrategy'

const WORD_BINARY_TEXT_DECODER = new TextDecoder('latin1')

@Service(
  { id: DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, multiple: true },
  [
    MimeTypeService.SERVICE_ID,
    FileExtensionService.SERVICE_ID,
    MarkdownItService.SERVICE_ID,
    MammothConversionService.SERVICE_ID,
    ZipArchiveService.SERVICE_ID
  ]
)
export class WordDocumentImportStrategy extends DocumentImportStrategy {
  constructor(
    private readonly mimeTypeService: MimeTypeService,
    private readonly fileExtensionService: FileExtensionService,
    private readonly markdownItService: MarkdownItService,
    private readonly mammothConversionService: MammothConversionService,
    private readonly zipArchiveService: ZipArchiveService
  ) {
    super()
  }

  readonly name = 'Word Document'
  readonly supportedMimeTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word.document.macroenabled.12'
  ]

  readonly supportedExtensions = ['doc', 'docx', 'docm']

  canRead(file: DocumentFileLike): boolean {
    return this.mimeTypeService.matchesMimeType(file, this.supportedMimeTypes)
      || this.fileExtensionService.matchesFileExtension(file, this.supportedExtensions)
  }

  /**
   * @throws {InvalidDocxError} When the DOCX/DOCM file is invalid or corrupted
   * @throws {UnreadableDocError} When the DOC file content cannot be read
   */
  async read(file: DocumentFileLike, options?: DocumentReadOptions): Promise<string> {
    const extension = this.fileExtensionService.resolveFileExtension(file?.name)
    const wordArrayBuffer = await file.arrayBuffer()
    const shouldParseAsOpenXml = extension === 'docx'
      || extension === 'docm'
      || this.zipArchiveService.looksLikeZipArchive(wordArrayBuffer)

    if (shouldParseAsOpenXml) {
      const imageStoringStrategy = options?.images ?? new DataUrlImageStoringStrategy()
      const imageConverter = (buffer: ArrayBuffer, contentType: string): Promise<string> =>
        imageStoringStrategy.storeImage(buffer, contentType)

      try {
        const normalizedDocxHtml = await this.mammothConversionService.convertToHtml(
          wordArrayBuffer,
          imageConverter
        )

        if (normalizedDocxHtml) {
          return this.markdownItService.htmlToMarkdown(normalizedDocxHtml)
        }
      } catch (error) {
        if (extension === 'docx' || extension === 'docm') {
          throw new InvalidDocxError()
        }
        throw error
      }

      if (extension === 'docx' || extension === 'docm') {
        throw new InvalidDocxError()
      }
    }

    return this.markdownItService.plainTextToMarkdown(
      this.extractReadableWordBinaryText(wordArrayBuffer)
    )
  }

  /**
   * @throws {UnreadableDocError} When no readable content can be extracted
   */
  private extractReadableWordBinaryText(arrayBuffer: ArrayBuffer): string {
    const rawContent = WORD_BINARY_TEXT_DECODER.decode(new Uint8Array(arrayBuffer))
    const normalizedContent = rawContent
      .replace(/[^\x20-\x7E\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    if (!normalizedContent) {
      throw new UnreadableDocError()
    }

    return normalizedContent
  }
}
