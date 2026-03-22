import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('mammoth/mammoth.browser.js', () => ({
  default: {
    convertToHtml: vi.fn()
  }
}))

import mammoth from 'mammoth/mammoth.browser.js'
import { MammothConversionService } from '../../src/services/MammothConversionService'

describe('MammothConversionService', () => {
  const mammothConversionService = new MammothConversionService()
  const convertToHtmlMock = vi.mocked(mammoth.convertToHtml)

  beforeEach(() => {
    convertToHtmlMock.mockReset()
  })

  it('normalizes mammoth html output', async () => {
    convertToHtmlMock.mockResolvedValue({ value: '  <p>Doc</p>  ' } as never)
    await expect(mammothConversionService.convertToHtml(new ArrayBuffer(0))).resolves.toBe('<p>Doc</p>')
  })
})
