import { DocumentImportError } from './DocumentImportError'

export class InvalidPagesError extends DocumentImportError {
  constructor() {
    super('invalid-pages', 'Invalid Apple Pages file.')
  }
}
