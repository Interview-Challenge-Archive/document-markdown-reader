import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../../src/errors/DocumentImportError'
import { InvalidDocxError } from '../../../src/errors/InvalidDocxError'

describe('InvalidDocxError', () => {
  it('creates expected code and message', () => {
    const error = new InvalidDocxError()

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe('invalid-docx')
    expect(error.message).toBe('Invalid DOCX or DOCM file.')
    expect(error.name).toBe('InvalidDocxError')
  })
})
