import { DocumentImportError } from './DocumentImportError'

export class InvalidDocxError extends DocumentImportError {
  constructor() {
    super('invalid-docx', 'Invalid DOCX or DOCM file.')
  }
}
