import { UnreadableDocumentError } from './UnreadableDocumentError'

export class UnreadablePdfError extends UnreadableDocumentError {
  constructor() {
    super('pdf')
  }
}
