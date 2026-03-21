import { DocumentImportError } from './DocumentImportError'

export class UnreadablePdfError extends DocumentImportError {
  constructor() {
    super('unreadable-pdf', 'No readable text found in PDF file.')
  }
}
