import type { PdfPageTextItem } from './PdfPageTextItem'

export interface PdfPageProxy {
  getTextContent(): Promise<{ items: PdfPageTextItem[] }>
}
