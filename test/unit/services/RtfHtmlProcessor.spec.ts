import { describe, expect, it } from 'vitest'
import type { ProcessTokensGlobalState } from 'rtf-stream-parser/dist/src/ProcessTokens.types'
import type { FeatureHandler } from 'rtf-stream-parser/dist/src/features/types'
import { HtmlEscapeService } from '../../../src/services/HtmlEscapeService'
import { RtfHtmlProcessor } from '../../../src/services/RtfHtmlProcessor'

describe('RtfHtmlProcessor', () => {
  it('renders styled chunks to html paragraphs', () => {
    const processor = createProcessor()
    processor.styledChunks = [
      { value: 'Normal <text>', bold: false, italic: false },
      { value: ' Bold', bold: true, italic: false },
      { value: ' Both', bold: true, italic: true },
      { value: '\nNext line', bold: false, italic: false }
    ]

    expect(processor.toHtml()).toBe(
      '<p>Normal &lt;text&gt;<strong> Bold</strong><strong><em> Both</em></strong></p>\n\n<p>Next line</p>'
    )
  })

  it('skips captured output for suppressed destinations', () => {
    const processor = createProcessor()

    processor._state.destIgnorable = true
    processor.captureVisibleOutput('ignored')

    expect(processor.styledChunks).toEqual([])
  })

  it('captures visible output and merges adjacent chunks with same style', () => {
    const processor = createProcessor()

    processor._state.bold = true
    processor.captureVisibleOutput('Bold')
    processor.captureVisibleOutput(' text')

    processor._state.bold = false
    processor._state.italic = true
    processor.captureVisibleOutput(' Italic')

    expect(processor.styledChunks).toEqual([
      { value: 'Bold text', bold: true, italic: false },
      { value: ' Italic', bold: false, italic: true }
    ])
  })
})

function createProcessor(): RtfHtmlProcessor {
  const noopFeature: FeatureHandler<ProcessTokensGlobalState> = {}

  return new RtfHtmlProcessor(
    new HtmlEscapeService(),
    noopFeature,
    noopFeature
  )
}
