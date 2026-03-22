import { describe, expect, it, vi } from 'vitest'
import { InvalidOdtError } from '../../../src/errors/InvalidOdtError'
import { FileExtensionService } from '../../../src/services/FileExtensionService'
import { MimeTypeService } from '../../../src/services/MimeTypeService'
import type { OpenDocumentConversionService } from '../../../src/services/OpenDocumentConversionService'
import { OpenDocumentImportStrategy } from '../../../src/strategies/OpenDocumentImportStrategy'
import { createTextFile } from './_test-helpers'

describe('OpenDocumentImportStrategy', () => {
  it('handles FODT by extension and ODT by default', async () => {
    const openDocumentConversionService = {
      convertFodtToMarkdown: vi.fn().mockResolvedValue('# FODT'),
      convertOdtToMarkdown: vi.fn().mockResolvedValue('# ODT')
    }
    const strategy = new OpenDocumentImportStrategy(
      openDocumentConversionService as unknown as OpenDocumentConversionService,
      new MimeTypeService(),
      new FileExtensionService()
    )

    await expect(strategy.read(createTextFile('<xml/>', 'doc.fodt', 'text/plain'))).resolves.toBe('# FODT')
    await expect(
      strategy.read(createTextFile('ignored', 'doc.odt', 'application/vnd.oasis.opendocument.text'))
    ).resolves.toBe('# ODT')
    expect(openDocumentConversionService.convertFodtToMarkdown).toHaveBeenCalledTimes(1)
    expect(openDocumentConversionService.convertOdtToMarkdown).toHaveBeenCalledTimes(1)
  })

  it('treats flat-xml mime type as FODT even without extension', async () => {
    const openDocumentConversionService = {
      convertFodtToMarkdown: vi.fn().mockResolvedValue('# Flat'),
      convertOdtToMarkdown: vi.fn()
    }
    const strategy = new OpenDocumentImportStrategy(
      openDocumentConversionService as unknown as OpenDocumentConversionService,
      new MimeTypeService(),
      new FileExtensionService()
    )

    await expect(
      strategy.read(createTextFile('<xml/>', 'document.bin', 'application/vnd.oasis.opendocument.text-flat-xml'))
    ).resolves.toBe('# Flat')
    expect(openDocumentConversionService.convertFodtToMarkdown).toHaveBeenCalledTimes(1)
    expect(openDocumentConversionService.convertOdtToMarkdown).not.toHaveBeenCalled()
  })

  it('wraps conversion failures as InvalidOdtError', async () => {
    const strategy = new OpenDocumentImportStrategy(
      { convertFodtToMarkdown: vi.fn(), convertOdtToMarkdown: vi.fn().mockRejectedValue(new Error('bad odt')) } as unknown as OpenDocumentConversionService,
      new MimeTypeService(),
      new FileExtensionService()
    )

    await expect(
      strategy.read(createTextFile('binary', 'broken.odt', 'application/vnd.oasis.opendocument.text'))
    ).rejects.toBeInstanceOf(InvalidOdtError)
  })
})
