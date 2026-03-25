import type { PdfDocumentProxy } from './PdfDocumentProxy'

export interface PdfJsModule {
  version?: string

  getDocument(options: Record<string, unknown>): {
    promise: Promise<PdfDocumentProxy>
  }
}
