import { beforeEach, describe, expect, it, vi } from 'vitest'
import { odtToHtml } from 'odf-kit/reader'
import { MarkdownItService } from '../../../src/services/MarkdownItService'
import { OpenDocumentConversionService } from '../../../src/services/OpenDocumentConversionService'

vi.mock('odf-kit/reader', () => ({
  odtToHtml: vi.fn()
}))

describe('OpenDocumentConversionService', () => {
  const odtToHtmlMock = vi.mocked(odtToHtml)

  beforeEach(() => {
    odtToHtmlMock.mockReset()
  })

  it('converts ODT content via odtToHtml', async () => {
    odtToHtmlMock.mockReturnValue('<h1>ODT</h1>')

    const openDocumentConversionService = new OpenDocumentConversionService(
      new MarkdownItService()
    )

    await expect(openDocumentConversionService.convertOdtToMarkdown(new ArrayBuffer(5))).resolves.toBe('# ODT')
  })
})
