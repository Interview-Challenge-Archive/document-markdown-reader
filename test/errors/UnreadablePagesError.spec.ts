import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../src/errors/DocumentImportError'
import { UnreadablePagesError } from '../../src/errors/UnreadablePagesError'

describe('UnreadablePagesError', () => {
  it('creates expected code and message', () => {
    const error = new UnreadablePagesError()

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe('unreadable-pages')
    expect(error.message).toBe('No readable content found in Apple Pages file.')
    expect(error.name).toBe('UnreadablePagesError')
  })
})
