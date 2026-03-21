import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../src/errors/DocumentImportError'
import { InvalidPdfError } from '../../src/errors/InvalidPdfError'

describe('InvalidPdfError', () => {
  it('creates expected code and message', () => {
    const error = new InvalidPdfError()

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe('invalid-pdf')
    expect(error.message).toBe('Invalid PDF file.')
    expect(error.name).toBe('InvalidPdfError')
  })
})
