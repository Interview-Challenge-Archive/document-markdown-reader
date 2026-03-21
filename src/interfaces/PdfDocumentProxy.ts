import type { PdfPageProxy } from './PdfPageProxy'

export interface PdfDocumentProxy {
  numPages: number
  getPage(pageNumber: number): Promise<PdfPageProxy>
  destroy?: () => Promise<void> | void
}
