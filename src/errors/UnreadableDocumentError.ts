import { DocumentImportError } from './DocumentImportError'

export type UnreadableDocumentFormat = 'doc' | 'pages' | 'pdf'

const ERROR_MESSAGES: Record<UnreadableDocumentFormat, string> = {
  doc: 'No readable text found in Word binary document.',
  pages: 'No readable content found in Apple Pages file.',
  pdf: 'No readable text found in PDF file.',
}

export class UnreadableDocumentError extends DocumentImportError {
  readonly format: UnreadableDocumentFormat

  constructor(format: UnreadableDocumentFormat) {
    const code = `unreadable-${format}`
    super(code, ERROR_MESSAGES[format])
    this.format = format
    this.name = new.target.name
  }
}
