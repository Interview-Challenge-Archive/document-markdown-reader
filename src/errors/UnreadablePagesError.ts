import { UnreadableDocumentError } from './UnreadableDocumentError'

export class UnreadablePagesError extends UnreadableDocumentError {
  constructor() {
    super('pages')
  }
}
