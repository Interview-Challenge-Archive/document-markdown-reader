import { describe, expect, it } from 'vitest'
import { UnsupportedFormatError } from '../../../src/errors/UnsupportedFormatError'
import { DocumentReadStrategyResolver } from '../../../src/resolvers/DocumentReadStrategyResolver'
import { FileExtensionService } from '../../../src/services/FileExtensionService'
import { MimeTypeService } from '../../../src/services/MimeTypeService'
import type { DocumentImportStrategy } from '../../../src/strategies/DocumentImportStrategy'
import type { DocumentFileLike } from '../../../src/types/DocumentFileLike'

type TestStrategyConfig = {
  name: string
  supportedExtensions: ReadonlyArray<string>
  supportedMimeTypes: ReadonlyArray<string>
  canRead?: (file: DocumentFileLike) => boolean
}

function createFileLike(name: string, type: string): DocumentFileLike {
  return {
    name,
    type,
    async text() {
      return ''
    },
    async arrayBuffer() {
      return new ArrayBuffer(0)
    }
  }
}

function createStrategy(config: TestStrategyConfig): DocumentImportStrategy {
  return {
    name: config.name,
    supportedExtensions: config.supportedExtensions,
    supportedMimeTypes: config.supportedMimeTypes,
    canRead(file: DocumentFileLike): boolean {
      return config.canRead?.(file) ?? true
    },
    async read() {
      return ''
    }
  }
}

describe('DocumentReadStrategyResolver', () => {
  it('collects unique sorted extensions and accepted extensions', () => {
    const resolver = new DocumentReadStrategyResolver(
      new MimeTypeService(),
      new FileExtensionService(),
      [
        createStrategy({
          name: 'Markdown',
          supportedExtensions: ['md', 'markdown'],
          supportedMimeTypes: ['text/markdown']
        }),
        createStrategy({
          name: 'PlainText',
          supportedExtensions: ['txt', 'md'],
          supportedMimeTypes: ['text/plain']
        })
      ]
    )

    expect(resolver.supportedExtensions).toEqual(['markdown', 'md', 'txt'])
    expect(resolver.acceptedExtensions).toBe('.markdown,.md,.txt')
  })

  it('exposes supported formats for each strategy', () => {
    const resolver = new DocumentReadStrategyResolver(
      new MimeTypeService(),
      new FileExtensionService(),
      [
        createStrategy({
          name: 'Markdown',
          supportedExtensions: ['md', 'markdown'],
          supportedMimeTypes: ['text/markdown']
        }),
        createStrategy({
          name: 'PlainText',
          supportedExtensions: ['txt'],
          supportedMimeTypes: ['text/plain']
        })
      ]
    )

    expect(resolver.supportedFormats).toEqual([
      {
        name: 'Markdown',
        extensions: ['md', 'markdown']
      },
      {
        name: 'PlainText',
        extensions: ['txt']
      }
    ])
  })

  it('prioritizes extension matches over mime-only matches', () => {
    const extensionMatchStrategy = createStrategy({
      name: 'Docx',
      supportedExtensions: ['docx'],
      supportedMimeTypes: ['application/zip']
    })
    const mimeOnlyStrategy = createStrategy({
      name: 'Zip',
      supportedExtensions: ['zip'],
      supportedMimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    })
    const resolver = new DocumentReadStrategyResolver(
      new MimeTypeService(),
      new FileExtensionService(),
      [mimeOnlyStrategy, extensionMatchStrategy]
    )
    const file = createFileLike(
      'report.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

    expect(resolver.resolve(file)).toBe(extensionMatchStrategy)
  })

  it('skips strategies that cannot read a file', () => {
    const blockedStrategy = createStrategy({
      name: 'Blocked',
      supportedExtensions: ['txt'],
      supportedMimeTypes: ['text/plain'],
      canRead() {
        return false
      }
    })
    const fallbackStrategy = createStrategy({
      name: 'Fallback',
      supportedExtensions: ['txt'],
      supportedMimeTypes: ['text/plain']
    })
    const resolver = new DocumentReadStrategyResolver(
      new MimeTypeService(),
      new FileExtensionService(),
      [blockedStrategy, fallbackStrategy]
    )
    const file = createFileLike('notes.txt', 'text/plain')

    expect(resolver.resolve(file)).toBe(fallbackStrategy)
  })

  it('throws when no strategy can read the file', () => {
    const resolver = new DocumentReadStrategyResolver(
      new MimeTypeService(),
      new FileExtensionService(),
      [
        createStrategy({
          name: 'Never',
          supportedExtensions: ['txt'],
          supportedMimeTypes: ['text/plain'],
          canRead() {
            return false
          }
        })
      ]
    )
    const file = createFileLike('notes.txt', 'text/plain')

    expect(() => resolver.resolve(file)).toThrow(UnsupportedFormatError)
  })
})
