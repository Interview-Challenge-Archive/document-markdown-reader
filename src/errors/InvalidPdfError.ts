import { DocumentImportError } from './DocumentImportError'

export class InvalidPdfError extends DocumentImportError {
  constructor() {
    super('invalid-pdf', 'Invalid PDF file.')
  }
}
