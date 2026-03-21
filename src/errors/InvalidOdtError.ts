import { DocumentImportError } from './DocumentImportError'

export class InvalidOdtError extends DocumentImportError {
  constructor() {
    super('invalid-odt', 'Invalid ODT or FODT file.')
  }
}
