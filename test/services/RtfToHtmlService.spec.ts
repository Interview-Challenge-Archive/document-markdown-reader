import { describe, expect, it } from 'vitest'
import { HtmlEscapeService } from '../../src/services/HtmlEscapeService'
import { RtfToHtmlService } from '../../src/services/RtfToHtmlService'

describe('RtfToHtmlService', () => {
  const rtfToHtmlService = new RtfToHtmlService(new HtmlEscapeService())

  it('converts plain and styled rtf text to html', async () => {
    const html = await rtfToHtmlService.convertToHtml(
      '{\\rtf1\\ansi\\ansicpg1252\\pard Normal text section.\\par \\b Bold text section\\b0\\par \\i Italic text section\\i0\\par}'
    )

    expect(html).toContain('<p>Normal text section.</p>')
    expect(html).toContain('<strong>Bold text section</strong>')
    expect(html).toContain('<em>Italic text section</em>')
  })

  it('ignores metadata destinations from output', async () => {
    const html = await rtfToHtmlService.convertToHtml(
      '{\\rtf1\\ansi{\\fonttbl{\\f0 Arial;}}{\\colortbl;\\red0\\green0\\blue0;}Visible text}'
    )

    expect(html).toContain('<p>Visible text</p>')
    expect(html).not.toContain('Arial')
  })

  it('throws for invalid rtf input', async () => {
    await expect(rtfToHtmlService.convertToHtml('not rtf')).rejects.toThrow()
  })
})
