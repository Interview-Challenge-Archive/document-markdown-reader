import { describe, expect, it } from 'vitest'
import { MarkdownItService } from '../../../src/services/MarkdownItService'

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

  it('strips CSS style attributes from table elements when converting to markdown', () => {
    const result = markdownItService.htmlToMarkdown(
      '<table style="width:100%"><thead><tr style="background:#f5f5f5;"><th style="padding:8px;">Name</th><th style="color:blue;">Value</th></tr></thead><tbody><tr><td style="border:1px solid black;">Alice</td><td style="text-align:center;">30</td></tr></tbody></table>'
    )
    expect(result).not.toContain('style=')
    expect(result).toContain('Name')
    expect(result).toContain('Value')
    expect(result).toContain('Alice')
    expect(result).toContain('30')
  })

  it('strips CSS style attributes from tables that fall back to raw HTML', () => {
    const result = markdownItService.htmlToMarkdown(
      '<table style="width:100%"><tbody><tr><td style="color:red;">A</td><td style="background:blue;">B</td></tr></tbody></table>'
    )
    expect(result).not.toContain('style=')
    expect(result).toContain('A')
    expect(result).toContain('B')
  })
})
