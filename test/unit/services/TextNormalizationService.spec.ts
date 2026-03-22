import { describe, expect, it } from 'vitest'
import { TextNormalizationService } from '../../../src/services/TextNormalizationService'

describe('TextNormalizationService', () => {
  const textNormalizationService = new TextNormalizationService()

  it('unescapes markdown control characters', () => {
    expect(textNormalizationService.unescapeMarkdownControlCharacters('\\[link\\]\\(x\\)')).toBe('[link](x)')
    expect(textNormalizationService.unescapeMarkdownControlCharacters('keep normal text')).toBe('keep normal text')
  })

  it('normalizes CRLF line endings to LF', () => {
    expect(textNormalizationService.normalizeNewlines('line1\r\nline2\r\nline3')).toBe('line1\nline2\nline3')
    expect(textNormalizationService.normalizeNewlines('line1\nline2')).toBe('line1\nline2')
  })
})
