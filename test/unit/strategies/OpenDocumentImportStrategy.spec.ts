import { describe, expect, it, vi } from 'vitest'
import { InvalidOdtError } from '../../../src/errors/InvalidOdtError'
import { FileExtensionService } from '../../../src/services/FileExtensionService'
import { MimeTypeService } from '../../../src/services/MimeTypeService'
import type { OpenDocumentConversionService } from '../../../src/services/OpenDocumentConversionService'
import { OpenDocumentImportStrategy } from '../../../src/strategies/OpenDocumentImportStrategy'
import { createTextFile } from './_test-helpers'

describe('OpenDocumentImportStrategy', () => {
  it('handles ODT by extension or mime type', async () => {
    const openDocumentConversionService = {
      convertOdtToMarkdown: vi.fn().mockResolvedValue('# ODT')
    }
    const strategy = new OpenDocumentImportStrategy(
      openDocumentConversionService as unknown as OpenDocumentConversionService,
      new MimeTypeService(),
      new FileExtensionService()
    )

    await expect(strategy.read(createTextFile('content', 'doc.odt', 'text/plain'))).resolves.toBe('# ODT')
    await expect(
      strategy.read(createTextFile('ignored', 'doc.odt', 'application/vnd.oasis.opendocument.text'))
    ).resolves.toBe('# ODT')
    expect(openDocumentConversionService.convertOdtToMarkdown).toHaveBeenCalledTimes(2)
  })

  it('wraps conversion failures as InvalidOdtError', async () => {
    const strategy = new OpenDocumentImportStrategy(
      { convertOdtToMarkdown: vi.fn().mockRejectedValue(new Error('bad odt')) } as unknown as OpenDocumentConversionService,
      new MimeTypeService(),
      new FileExtensionService()
    )

    await expect(
      strategy.read(createTextFile('binary', 'broken.odt', 'application/vnd.oasis.opendocument.text'))
    ).rejects.toBeInstanceOf(InvalidOdtError)
  })
})
