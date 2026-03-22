import { InvalidDocumentError } from './InvalidDocumentError'

export class InvalidDocxError extends InvalidDocumentError {
  constructor() {
    super('docx')
  }
}
