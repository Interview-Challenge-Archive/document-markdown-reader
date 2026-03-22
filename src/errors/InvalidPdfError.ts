import { InvalidDocumentError } from './InvalidDocumentError'

export class InvalidPdfError extends InvalidDocumentError {
  constructor() {
    super('pdf')
  }
}
