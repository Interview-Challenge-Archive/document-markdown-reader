import type { PdfDocumentProxy } from './PdfDocumentProxy'

export interface PdfJsModule {
  version?: string
  GlobalWorkerOptions?: {
    workerSrc?: string
  }

  getDocument(options: Record<string, unknown>): {
    promise: Promise<PdfDocumentProxy>
  }
}
