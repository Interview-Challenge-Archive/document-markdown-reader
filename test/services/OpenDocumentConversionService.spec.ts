import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@jose.espana/docstream', () => ({
  parseOffice: vi.fn()
}))

import { parseOffice } from '@jose.espana/docstream'
import { OpenDocumentConversionService } from '../../src/services/OpenDocumentConversionService'
import type { ZipArchiveService } from '../../src/services/ZipArchiveService'

describe('OpenDocumentConversionService', () => {
  const parseOfficeMock = vi.mocked(parseOffice)

  beforeEach(() => {
    parseOfficeMock.mockReset()
  })

  it('converts ODT content with parseOffice', async () => {
    parseOfficeMock.mockResolvedValue({
      toMarkdown: () => '  # ODT  '
    } as never)

    const openDocumentConversionService = new OpenDocumentConversionService({
      createArchive: vi.fn()
    } as unknown as ZipArchiveService)

    await expect(openDocumentConversionService.convertOdtToMarkdown(new ArrayBuffer(5))).resolves.toBe('# ODT')
  })

  it('returns empty markdown for empty FODT content', async () => {
    const createArchiveMock = vi.fn()
    const openDocumentConversionService = new OpenDocumentConversionService({
      createArchive: createArchiveMock
    } as unknown as ZipArchiveService)

    await expect(openDocumentConversionService.convertFodtToMarkdown('   ')).resolves.toBe('')
    expect(createArchiveMock).not.toHaveBeenCalled()
  })

  it('wraps flat xml into a temporary archive before conversion', async () => {
    const generatedArchive = new ArrayBuffer(7)
    const archive = {
      file: vi.fn(),
      generateAsync: vi.fn().mockResolvedValue(generatedArchive)
    }
    const createArchiveMock = vi.fn().mockReturnValue(archive)

    parseOfficeMock.mockResolvedValue({
      toMarkdown: () => 'Flat Markdown'
    } as never)

    const openDocumentConversionService = new OpenDocumentConversionService({
      createArchive: createArchiveMock
    } as unknown as ZipArchiveService)

    await expect(
      openDocumentConversionService.convertFodtToMarkdown('<office:document>Flat</office:document>')
    ).resolves.toBe('Flat Markdown')

    expect(createArchiveMock).toHaveBeenCalledTimes(1)
    expect(archive.file).toHaveBeenCalledWith(
      'mimetype',
      'application/vnd.oasis.opendocument.text',
      { compression: 'STORE' }
    )
    expect(archive.file).toHaveBeenCalledWith('content.xml', '<office:document>Flat</office:document>')
    expect(archive.generateAsync).toHaveBeenCalledWith({ type: 'arraybuffer' })
    expect(parseOfficeMock).toHaveBeenCalledWith(generatedArchive)
  })
})
