import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../src/errors/DocumentImportError'

class TestDocumentImportError extends DocumentImportError {
  constructor() {
    super('test-code', 'Test message.')
  }
}

describe('DocumentImportError', () => {
  it('sets shared error metadata in subclasses', () => {
    const error = new TestDocumentImportError()

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.name).toBe('TestDocumentImportError')
    expect(error.code).toBe('test-code')
    expect(error.message).toBe('Test message.')
  })
})
