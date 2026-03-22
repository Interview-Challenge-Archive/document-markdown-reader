import { InvalidDocumentError } from './InvalidDocumentError'

export class InvalidOdtError extends InvalidDocumentError {
  constructor() {
    super('odt')
  }
}
