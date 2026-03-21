import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../src/errors/DocumentImportError'
import { UnsupportedFormatError } from '../../src/errors/UnsupportedFormatError'

describe('UnsupportedFormatError', () => {
  it('creates expected code and message', () => {
    const error = new UnsupportedFormatError()

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe('unsupported-format')
    expect(error.message).toBe('Unsupported document format.')
    expect(error.name).toBe('UnsupportedFormatError')
  })
})
