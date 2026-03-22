import { describe, expect, it } from 'vitest'
import { HtmlEscapeService } from '../../../src/services/HtmlEscapeService'

describe('HtmlEscapeService', () => {
  const htmlEscapeService = new HtmlEscapeService()

  it('escapes html control characters', () => {
    expect(htmlEscapeService.escape('<a href="x">& hello ></a>')).toBe('&lt;a href="x"&gt;&amp; hello &gt;&lt;/a&gt;')
  })

  it('returns unchanged value when nothing requires escaping', () => {
    expect(htmlEscapeService.escape('Plain text 123')).toBe('Plain text 123')
  })
})
