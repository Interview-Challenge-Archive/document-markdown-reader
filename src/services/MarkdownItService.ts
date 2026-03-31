import { Service } from '@freshgum/typedi'
import MarkdownIt from 'markdown-it'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

type MarkdownItPlugin = (markdownIt: MarkdownIt) => void

const MARKDOWN_IT_PLUGINS: ReadonlyArray<MarkdownItPlugin> = [
  // Centralized plugin pipeline for markdown-it behavior used by helper services.
  (markdownIt) => {
    void markdownIt
  }
]
const TURNDOWN = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**'
})

TURNDOWN.use(gfm)

@Service({ id: MarkdownItService.SERVICE_ID }, [])
export class MarkdownItService {
  static readonly SERVICE_ID = 'MarkdownItService'

  private readonly markdownIt: MarkdownIt

  constructor() {
    this.markdownIt = new MarkdownIt({
      html: false,
      linkify: false,
      typographer: false
    })

    for (const plugin of MARKDOWN_IT_PLUGINS) {
      this.markdownIt.use(plugin)
    }
  }

  escapeHtml(value: string): string {
    return this.markdownIt.utils.escapeHtml(value)
  }

  isAsciiPunctuation(charCode: number): boolean {
    return this.markdownIt.utils.isMdAsciiPunct(charCode)
  }

  escapeMarkdownInline(value: string | null | undefined): string {
    const normalizedValue = String(value ?? '')
    const escapedHtml = this.escapeHtml(normalizedValue)
    let escapedValue = ''

    for (const character of escapedHtml) {
      const characterCode = character.charCodeAt(0)

      if (character === '\\') {
        escapedValue += '\\\\'
        continue
      }

      if (this.isAsciiPunctuation(characterCode)) {
        escapedValue += `\\${character}`
        continue
      }

      escapedValue += character
    }

    return escapedValue
  }

  plainTextToMarkdown(text: string | null | undefined): string {
    const normalizedText = String(text ?? '').replace(/\r\n?/g, '\n')

    if (!normalizedText) {
      return ''
    }

    return normalizedText
      .split('\n')
      .map((line) => this.escapeMarkdownInline(line))
      .join('\n')
  }

  htmlToMarkdown(value: string | null | undefined): string {
    const normalizedValue = this.stripStyleAttributes(String(value ?? '')).trim()

    if (!normalizedValue) {
      return ''
    }

    try {
      return TURNDOWN.turndown(normalizedValue)
    } catch {
      return this.extractPlainTextFromHtml(normalizedValue)
    }
  }

  private stripStyleAttributes(html: string): string {
    return html
      .replace(/\s*style\s*=\s*"(?:[^"\\]|\\.)*"/gi, '')
      .replace(/\s*style\s*=\s*'(?:[^'\\]|\\.)*'/gi, '')
  }

  private extractPlainTextFromHtml(value: string): string {
    if (typeof DOMParser === 'undefined') {
      return String(value ?? '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    }

    const parser = new DOMParser()
    const parsedDocument = parser.parseFromString(String(value ?? ''), 'text/html')

    return String(parsedDocument.body?.textContent ?? '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
}
