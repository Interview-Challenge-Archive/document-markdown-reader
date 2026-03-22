import { decode } from 'iconv-lite'
import { ProcessTokens } from 'rtf-stream-parser/dist/src/ProcessTokens'
import type { ProcessTokensGlobalState } from 'rtf-stream-parser/dist/src/ProcessTokens.types'
import { checkVersion } from 'rtf-stream-parser/dist/src/features/checkVersion'
import { countTokens } from 'rtf-stream-parser/dist/src/features/countTokens'
import { handleCharacterSet } from 'rtf-stream-parser/dist/src/features/handleCharacterSet'
import { handleControlsAndDestinations } from 'rtf-stream-parser/dist/src/features/handleControlsAndDestinations'
import { handleFonts } from 'rtf-stream-parser/dist/src/features/handleFonts'
import { handleGroupState } from 'rtf-stream-parser/dist/src/features/handleGroupState'
import { handleOutput } from 'rtf-stream-parser/dist/src/features/handleOutput'
import { handleUnicodeSkip } from 'rtf-stream-parser/dist/src/features/handleUnicodeSkip'
import { handleTextEscapes } from 'rtf-stream-parser/dist/src/features/textEscapes'
import type { FeatureHandler } from 'rtf-stream-parser/dist/src/features/types'
import { HtmlEscapeService } from './HtmlEscapeService'
import type { RtfHtmlExtractionState, RtfHtmlGroupState, StyledChunk } from '../types/RtfToHtmlTypes'

export class RtfHtmlProcessor extends ProcessTokens implements RtfHtmlExtractionState {
  private static readonly SUPPRESSED_DESTINATIONS = new Set<string>([
    'annotation',
    'atnauthor',
    'atnid',
    'colortbl',
    'datastore',
    'doccomm',
    'filetbl',
    'fonttbl',
    'info',
    'listtext',
    'mmath',
    'mmathpr',
    'nonshppict',
    'object',
    'objclass',
    'objdata',
    'objname',
    'objtime',
    'pict',
    'private',
    'props',
    'revtbl',
    'rsidtbl',
    'stylesheet',
    'themedata',
    'xmlattrname',
    'xmlattrvalue',
    'xmlclose',
    'xmlname',
    'xmlnstbl',
    'xmlopen'
  ])

  _featureHandlers: Array<FeatureHandler<ProcessTokensGlobalState>>

  readonly _rootState: RtfHtmlGroupState = {
    groupDepth: 0,
    destDepth: 0,
    destGroupDepth: 0,
    uc: 1,
    bold: false,
    italic: false
  }

  _state: RtfHtmlGroupState = this._rootState
  styledChunks: StyledChunk[] = []

  constructor(
    private readonly htmlEscapeService: HtmlEscapeService,
    formattingControls: FeatureHandler<ProcessTokensGlobalState>,
    captureVisibleOutput: FeatureHandler<ProcessTokensGlobalState>
  ) {
    super({ decode })
    this._featureHandlers = [
      countTokens,
      checkVersion,
      handleGroupState,
      handleUnicodeSkip,
      handleControlsAndDestinations,
      handleCharacterSet,
      handleFonts,
      formattingControls,
      handleOutput,
      handleTextEscapes,
      captureVisibleOutput
    ]
  }

  captureVisibleOutput(data: Buffer | string): true {
    if (this.shouldSuppressOutput()) {
      return true
    }

    const state = this._state as RtfHtmlGroupState
    const [value] = this._getOutputAsString(data, this._getCurrentFont())

    this.appendChunk(value, state.bold, state.italic)
    return true
  }

  toHtml(): string {
    const paragraphChunks = this.splitByParagraph()
    const paragraphs = paragraphChunks
      .map((paragraph) => this.renderParagraph(paragraph))
      .filter((paragraph) => paragraph.length > 0)

    return paragraphs.join('\n\n')
  }

  private shouldSuppressOutput(): boolean {
    const state = this._state as RtfHtmlGroupState

    if (state.destIgnorable) {
      return true
    }

    const activeDestinations = state.allDestinations as Record<string, boolean> | undefined
    if (activeDestinations == null) {
      return false
    }

    for (const destination of RtfHtmlProcessor.SUPPRESSED_DESTINATIONS) {
      if (activeDestinations[destination]) {
        return true
      }
    }

    return false
  }

  private appendChunk(value: string, bold: boolean | undefined, italic: boolean | undefined): void {
    if (!value) {
      return
    }

    const normalizedBold = bold === true
    const normalizedItalic = italic === true
    const lastChunk = this.styledChunks[this.styledChunks.length - 1]

    if (lastChunk != null && lastChunk.bold === normalizedBold && lastChunk.italic === normalizedItalic) {
      lastChunk.value += value
      return
    }

    this.styledChunks.push({
      value,
      bold: normalizedBold,
      italic: normalizedItalic
    })
  }

  private splitByParagraph(): StyledChunk[][] {
    const paragraphs: StyledChunk[][] = [[]]

    for (const chunk of this.styledChunks) {
      const normalizedValue = chunk.value.replace(/\r\n?/g, '\n')
      const pieces = normalizedValue.split('\n')

      for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
        const piece = pieces[pieceIndex]
        if (piece) {
          this.appendChunkToParagraph(paragraphs[paragraphs.length - 1], piece, chunk.bold, chunk.italic)
        }

        if (pieceIndex < pieces.length - 1) {
          paragraphs.push([])
        }
      }
    }

    return paragraphs
  }

  private appendChunkToParagraph(
    chunks: StyledChunk[],
    value: string,
    bold: boolean | undefined,
    italic: boolean | undefined
  ): void {
    const normalizedBold = bold === true
    const normalizedItalic = italic === true
    const lastChunk = chunks[chunks.length - 1]

    if (lastChunk != null && lastChunk.bold === normalizedBold && lastChunk.italic === normalizedItalic) {
      lastChunk.value += value
      return
    }

    chunks.push({
      value,
      bold: normalizedBold,
      italic: normalizedItalic
    })
  }

  private renderParagraph(chunks: ReadonlyArray<StyledChunk>): string {
    const renderedInline = chunks
      .map((chunk) => this.renderInlineChunk(chunk))
      .join('')
      .trim()

    if (!renderedInline) {
      return ''
    }

    return `<p>${renderedInline}</p>`
  }

  private renderInlineChunk(chunk: StyledChunk): string {
    const escapedValue = this.htmlEscapeService.escape(chunk.value)

    if (chunk.bold && chunk.italic) {
      return `<strong><em>${escapedValue}</em></strong>`
    }

    if (chunk.bold) {
      return `<strong>${escapedValue}</strong>`
    }

    if (chunk.italic) {
      return `<em>${escapedValue}</em>`
    }

    return escapedValue
  }
}
