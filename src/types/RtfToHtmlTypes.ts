import type { ProcessTokensGlobalState, ProcessTokensGroupState } from 'rtf-stream-parser/dist/src/ProcessTokens.types'

export type RtfHtmlGroupState = ProcessTokensGroupState & {
  bold?: boolean
  italic?: boolean
}

export type RtfHtmlExtractionState = ProcessTokensGlobalState & {
  _state: RtfHtmlGroupState
  _rootState: RtfHtmlGroupState
  styledChunks: StyledChunk[]
}

export type StyledChunk = {
  value: string
  bold: boolean
  italic: boolean
}
