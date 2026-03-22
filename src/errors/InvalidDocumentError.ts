import { DocumentImportError } from './DocumentImportError'

export type InvalidDocumentFormat = 'docx' | 'odt' | 'pages' | 'pdf'

const ERROR_MESSAGES: Record<InvalidDocumentFormat, string> = {
  docx: 'Invalid DOCX or DOCM file.',
  odt: 'Invalid ODT or FODT file.',
  pages: 'Invalid Apple Pages file.',
  pdf: 'Invalid PDF file.',
}

export class InvalidDocumentError extends DocumentImportError {
  readonly format: InvalidDocumentFormat

  constructor(format: InvalidDocumentFormat) {
    const code = `invalid-${format}`
    super(code, ERROR_MESSAGES[format])
    this.format = format
    this.name = new.target.name
  }
}
