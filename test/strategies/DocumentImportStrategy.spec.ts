import { describe, expect, it } from 'vitest'
import {
  DOCUMENT_IMPORT_STRATEGY_SERVICE_ID,
  DocumentImportStrategy
} from '../../src/strategies/DocumentImportStrategy'
import type { DocumentFileLike } from '../../src/types/DocumentFileLike'

class TestDocumentImportStrategy extends DocumentImportStrategy {
  static readonly supportedMimeTypes = ['application/test']
  static readonly supportedExtensions = ['test']

  readonly name = 'Test'
  readonly supportedMimeTypes = ['application/test']
  readonly supportedExtensions = ['test']

  canRead(file: DocumentFileLike): boolean {
    void file
    return true
  }

  async read(file: DocumentFileLike): Promise<string> {
    return await file.text()
  }
}

describe('DocumentImportStrategy', () => {
  it('keeps shared service id constant', () => {
    expect(DocumentImportStrategy.SERVICE_ID).toBe(DOCUMENT_IMPORT_STRATEGY_SERVICE_ID)
  })

  it('supports concrete subclasses', async () => {
    const strategy = new TestDocumentImportStrategy()
    const file: DocumentFileLike = {
      name: 'example.test',
      type: 'application/test',
      async text() {
        return 'content'
      },
      async arrayBuffer() {
        return new ArrayBuffer(0)
      }
    }

    expect(strategy.canRead(file)).toBe(true)
    await expect(strategy.read(file)).resolves.toBe('content')
  })
})
