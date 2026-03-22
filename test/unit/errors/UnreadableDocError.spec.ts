import { describe, expect, it } from 'vitest'
import { DocumentImportError } from '../../../src/errors/DocumentImportError'
import { UnreadableDocError } from '../../../src/errors/UnreadableDocError'

describe('UnreadableDocError', () => {
  it('creates expected code and message', () => {
    const error = new UnreadableDocError()

    expect(error).toBeInstanceOf(DocumentImportError)
    expect(error.code).toBe('unreadable-doc')
    expect(error.message).toBe('No readable text found in Word binary document.')
    expect(error.name).toBe('UnreadableDocError')
  })
})
