import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../../src/errors/DocumentImportError'
import { InvalidPagesError } from '../../../src/errors/InvalidPagesError'

describe('InvalidPagesError', () => {
  it('creates expected code and message', () => {
    const error = new InvalidPagesError()

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe('invalid-pages')
    expect(error.message).toBe('Invalid Apple Pages file.')
    expect(error.name).toBe('InvalidPagesError')
  })
})
