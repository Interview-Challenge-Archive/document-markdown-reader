import type { PdfDocumentProxy } from './PdfDocumentProxy'

export interface PdfJsModule {
  getDocument(options: Record<string, unknown>): {
    promise: Promise<PdfDocumentProxy>
  }
}
