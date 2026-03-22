import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../../src/errors/DocumentImportError'
import {
  UnreadableDocumentError,
  type UnreadableDocumentFormat
} from '../../../src/errors/UnreadableDocumentError'

const scenarios: Array<{
  format: UnreadableDocumentFormat
  code: string
  message: string
}> = [
  {
    format: 'doc',
    code: 'unreadable-doc',
    message: 'No readable text found in Word binary document.'
  },
  {
    format: 'pages',
    code: 'unreadable-pages',
    message: 'No readable content found in Apple Pages file.'
  },
  {
    format: 'pdf',
    code: 'unreadable-pdf',
    message: 'No readable text found in PDF file.'
  }
]

describe('UnreadableDocumentError', () => {
  it.each(scenarios)('creates expected metadata for $format', ({ format, code, message }) => {
    const error = new UnreadableDocumentError(format)

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe(code)
    expect(error.message).toBe(message)
    expect(error.format).toBe(format)
    expect(error.name).toBe('UnreadableDocumentError')
  })
})
