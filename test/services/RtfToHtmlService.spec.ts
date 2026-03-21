import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@iarna/rtf-to-html', () => ({
  default: {
    fromString: vi.fn()
  }
}))

import rtfToHtml from '@iarna/rtf-to-html'
import { RtfToHtmlService } from '../../src/services/RtfToHtmlService'

describe('RtfToHtmlService', () => {
  const rtfToHtmlService = new RtfToHtmlService()
  const fromStringMock = vi.mocked(rtfToHtml.fromString)

  beforeEach(() => {
    fromStringMock.mockReset()
  })

  it('converts rtf text to trimmed html', async () => {
    fromStringMock.mockImplementation((_rtf, _options, callback) => {
      callback(null, '  <p>Hello</p>  ')
    })

    await expect(rtfToHtmlService.convertToHtml('{\\rtf1 Hello}')).resolves.toBe('<p>Hello</p>')
  })

  it('rejects when conversion fails', async () => {
    fromStringMock.mockImplementation((_rtf, _options, callback) => {
      callback(new Error('convert failed'))
    })

    await expect(rtfToHtmlService.convertToHtml('{\\rtf1 Broken}')).rejects.toThrow('convert failed')
  })
})
