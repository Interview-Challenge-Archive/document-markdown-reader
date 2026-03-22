import { Service } from '@freshgum/typedi'

@Service({ id: HtmlEscapeService.SERVICE_ID }, [])
export class HtmlEscapeService {
  static readonly SERVICE_ID = 'HtmlEscapeService'

  escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
}
