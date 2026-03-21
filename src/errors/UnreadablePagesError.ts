import { DocumentImportError } from './DocumentImportError'

export class UnreadablePagesError extends DocumentImportError {
  constructor() {
    super('unreadable-pages', 'No readable content found in Apple Pages file.')
  }
}
