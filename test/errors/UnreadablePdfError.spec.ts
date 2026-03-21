import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../src/errors/DocumentImportError'
import { UnreadablePdfError } from '../../src/errors/UnreadablePdfError'

describe('UnreadablePdfError', () => {
  it('creates expected code and message', () => {
    const error = new UnreadablePdfError()

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe('unreadable-pdf')
    expect(error.message).toBe('No readable text found in PDF file.')
    expect(error.name).toBe('UnreadablePdfError')
  })
})
