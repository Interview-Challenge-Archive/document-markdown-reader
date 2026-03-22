import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../../src/errors/DocumentImportError'
import {
  InvalidDocumentError,
  type InvalidDocumentFormat
} from '../../../src/errors/InvalidDocumentError'

const scenarios: Array<{
  format: InvalidDocumentFormat
  code: string
  message: string
}> = [
  {
    format: 'docx',
    code: 'invalid-docx',
    message: 'Invalid DOCX or DOCM file.'
  },
  {
    format: 'odt',
    code: 'invalid-odt',
    message: 'Invalid ODT or FODT file.'
  },
  {
    format: 'pages',
    code: 'invalid-pages',
    message: 'Invalid Apple Pages file.'
  },
  {
    format: 'pdf',
    code: 'invalid-pdf',
    message: 'Invalid PDF file.'
  }
]

describe('InvalidDocumentError', () => {
  it.each(scenarios)('creates expected metadata for $format', ({ format, code, message }) => {
    const error = new InvalidDocumentError(format)

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe(code)
    expect(error.message).toBe(message)
    expect(error.format).toBe(format)
    expect(error.name).toBe('InvalidDocumentError')
  })
})
