import { InvalidDocumentError } from './InvalidDocumentError'

export class InvalidPagesError extends InvalidDocumentError {
  constructor() {
    super('pages')
  }
}
