import { Service } from '@freshgum/typedi'
import rtfToHtml from '@iarna/rtf-to-html'

@Service({ id: RtfToHtmlService.SERVICE_ID }, [])
export class RtfToHtmlService {
  static readonly SERVICE_ID = 'RtfToHtmlService'

  async convertToHtml(rtfValue: string): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      rtfToHtml.fromString(
        rtfValue,
        {
          template: (_document: unknown, _defaults: unknown, content: string) => content
        },
        (error: Error | null, html?: string) => {
          if (error) {
            reject(error)
            return
          }

          resolve(String(html ?? '').trim())
        }
      )
    })
  }
}
