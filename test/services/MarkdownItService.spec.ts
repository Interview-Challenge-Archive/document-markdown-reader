import { describe, expect, it } from 'vitest'
import { MarkdownItService } from '../../src/services/MarkdownItService'

describe('MarkdownItService', () => {
  const markdownItService = new MarkdownItService()

  it('escapes markdown punctuation and backslashes in inline text', () => {
    expect(markdownItService.escapeMarkdownInline('[link](x)\\')).toBe('\\[link\\]\\(x\\)\\\\')
    expect(markdownItService.isAsciiPunctuation('#'.charCodeAt(0))).toBe(true)
    expect(markdownItService.isAsciiPunctuation('A'.charCodeAt(0))).toBe(false)
  })

  it('escapes plain text into markdown-safe lines', () => {
    const markdown = markdownItService.plainTextToMarkdown('[a](b)\r\n# header')
    expect(markdown).toBe('\\[a\\]\\(b\\)\n\\# header')
  })

  it('converts html into markdown', () => {
    const markdown = markdownItService.htmlToMarkdown('<h2>Title</h2><p><strong>Body</strong></p>')
    expect(markdown).toContain('## Title')
    expect(markdown).toContain('**Body**')
  })

  it('returns empty markdown for empty html values', () => {
    expect(markdownItService.htmlToMarkdown('   ')).toBe('')
  })
})
