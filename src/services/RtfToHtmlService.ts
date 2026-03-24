import { Service } from '@freshgum/typedi'
import type { ProcessTokensGlobalState } from 'rtf-stream-parser/dist/src/ProcessTokens.types'
import type { FeatureHandler } from 'rtf-stream-parser/dist/src/features/types'
import { HtmlEscapeService } from './HtmlEscapeService'
import type { RtfHtmlProcessor } from './RtfHtmlProcessor'
import type { RtfHtmlGroupState } from '../types/RtfToHtmlTypes'

@Service({ id: RtfToHtmlService.SERVICE_ID }, [HtmlEscapeService.SERVICE_ID])
export class RtfToHtmlService {
  static readonly SERVICE_ID = 'RtfToHtmlService'

  constructor(
    private readonly htmlEscapeService: HtmlEscapeService
  ) {}

  private readonly formattingControls: FeatureHandler<ProcessTokensGlobalState> = {
    controlHandlers: {
      b: (global, token) => {
        const state = global._state as RtfHtmlGroupState
        state.bold = token.param !== 0
      },
      i: (global, token) => {
        const state = global._state as RtfHtmlGroupState
        state.italic = token.param !== 0
      },
      plain: (global) => {
        const state = global._state as RtfHtmlGroupState
        state.bold = false
        state.italic = false
      }
    }
  }

  private readonly captureVisibleOutput: FeatureHandler<ProcessTokensGlobalState> = {
    outputDataFilter: (global, data) => {
      const processor = global as unknown as RtfHtmlProcessor

      return processor.captureVisibleOutput(data)
    }
  }

  async convertToHtml(rtfValue: string | ArrayBuffer | Uint8Array): Promise<string> {
    const inputBuffer = this.toNodeBuffer(rtfValue)
    const [{ Tokenize }, { RtfHtmlProcessor }] = await Promise.all([
      import('rtf-stream-parser'),
      import('./RtfHtmlProcessor')
    ])
    const processor = new RtfHtmlProcessor(
      this.htmlEscapeService,
      this.formattingControls,
      this.captureVisibleOutput
    )
    const tokenizer = new Tokenize()

    return await new Promise<string>((resolve, reject) => {
      const fail = (error: Error) => {
        tokenizer.removeAllListeners()
        processor.removeAllListeners()
        reject(error)
      }

      tokenizer.once('error', fail)
      processor.once('error', fail)
      processor.once('finish', () => {
        resolve(processor.toHtml())
      })

      tokenizer.pipe(processor)
      tokenizer.end(inputBuffer)
    })
  }

  private toNodeBuffer(value: string | ArrayBuffer | Uint8Array): Buffer {
    if (typeof value === 'string') {
      return Buffer.from(value, 'utf8')
    }

    if (value instanceof Uint8Array) {
      return Buffer.from(value.buffer, value.byteOffset, value.byteLength)
    }

    return Buffer.from(value)
  }
}
