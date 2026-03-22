import { UnreadableDocumentError } from './UnreadableDocumentError'

export class UnreadableDocError extends UnreadableDocumentError {
  constructor() {
    super('doc')
  }
}
