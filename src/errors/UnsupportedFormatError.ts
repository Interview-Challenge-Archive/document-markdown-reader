import { DocumentImportError } from './DocumentImportError'

export class UnsupportedFormatError extends DocumentImportError {
  constructor() {
    super('unsupported-format', 'Unsupported document format.')
  }
}
