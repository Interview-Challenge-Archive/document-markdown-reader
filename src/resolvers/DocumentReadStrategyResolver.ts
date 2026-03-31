import { Many, Service } from '@freshgum/typedi'
import { FileExtensionService } from '../services/FileExtensionService'
import { MimeTypeService } from '../services/MimeTypeService'
import {
  DOCUMENT_IMPORT_STRATEGY_SERVICE_ID,
  type DocumentImportStrategy
} from '../strategies/document/DocumentImportStrategy'
import type { DocumentFileLike } from '../types/DocumentFileLike'
import { UnsupportedFormatError } from '../errors/UnsupportedFormatError'

export interface SupportedFormat {
  name: string
  extensions: ReadonlyArray<string>
}

@Service(
  { id: DocumentReadStrategyResolver.SERVICE_ID },
  [
    MimeTypeService.SERVICE_ID,
    FileExtensionService.SERVICE_ID,
    [DOCUMENT_IMPORT_STRATEGY_SERVICE_ID, Many()]
  ]
)
export class DocumentReadStrategyResolver {
  static readonly SERVICE_ID = 'document-read-strategy-resolver'
  readonly supportedExtensions: ReadonlyArray<string>
  readonly supportedFormats: ReadonlyArray<SupportedFormat>

  constructor(
    private readonly mimeTypeService: MimeTypeService,
    private readonly fileExtensionService: FileExtensionService,
    private readonly strategies: ReadonlyArray<DocumentImportStrategy>
  ) {
    this.supportedExtensions = this.collectSupportedExtensions(strategies)
    this.supportedFormats = this.collectSupportedFormats(strategies)
  }

  get acceptedExtensions(): string {
    return this.supportedExtensions
      .map((extension) => `.${extension}`)
      .join(',')
  }

  /**
   * @throws {UnsupportedFormatError} When no suitable strategy is found for the file format
   */
  resolve(file: DocumentFileLike): DocumentImportStrategy {
    const normalizedMimeType = this.mimeTypeService.normalizeMimeType(file?.type)
    const extension = this.fileExtensionService.resolveFileExtension(file?.name)
    let selectedStrategy: DocumentImportStrategy | null = null
    let selectedScore = -1

    for (const importStrategy of this.strategies) {
      if (!importStrategy.canRead(file)) {
        continue
      }

      const score = this.resolveStrategyScore(importStrategy, extension, normalizedMimeType)

      if (score > selectedScore) {
        selectedStrategy = importStrategy
        selectedScore = score
      }
    }

    if (!selectedStrategy) {
      throw new UnsupportedFormatError()
    }

    return selectedStrategy
  }

  private resolveStrategyScore(
    importStrategy: DocumentImportStrategy,
    extension: string,
    normalizedMimeType: string
  ): number {
    return Number(importStrategy.supportedExtensions.includes(extension)) * 2
      + Number(importStrategy.supportedMimeTypes.includes(normalizedMimeType))
  }

  private collectSupportedExtensions(
    strategies: ReadonlyArray<DocumentImportStrategy>
  ): ReadonlyArray<string> {
    const resolvedExtensions = new Set<string>()

    for (const strategy of strategies) {
      for (const extension of strategy.supportedExtensions) {
        resolvedExtensions.add(extension)
      }
    }

    return Object.freeze(Array.from(resolvedExtensions).sort())
  }

  private collectSupportedFormats(
    strategies: ReadonlyArray<DocumentImportStrategy>
  ): ReadonlyArray<SupportedFormat> {
    return Object.freeze(
      strategies.map((strategy) => ({
        name: strategy.name,
        extensions: Object.freeze([...strategy.supportedExtensions])
      }))
    )
  }
}
