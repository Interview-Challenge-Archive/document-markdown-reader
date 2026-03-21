import { DocumentImportError } from './DocumentImportError'

export class UnreadableDocError extends DocumentImportError {
  constructor() {
    super('unreadable-doc', 'No readable text found in Word binary document.')
  }
}
