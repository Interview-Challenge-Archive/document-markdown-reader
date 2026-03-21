import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../src/errors/DocumentImportError'
import { InvalidOdtError } from '../../src/errors/InvalidOdtError'

describe('InvalidOdtError', () => {
  it('creates expected code and message', () => {
    const error = new InvalidOdtError()

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe('invalid-odt')
    expect(error.message).toBe('Invalid ODT or FODT file.')
    expect(error.name).toBe('InvalidOdtError')
  })
})
