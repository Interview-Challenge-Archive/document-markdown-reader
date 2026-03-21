import { Service } from '@freshgum/typedi'
import mammoth from 'mammoth/mammoth.browser'

@Service({ id: MammothConversionService.SERVICE_ID }, [])
export class MammothConversionService {
  static readonly SERVICE_ID = 'MammothConversionService'

  async convertToHtml(arrayBuffer: ArrayBuffer): Promise<string> {
    const result = await mammoth.convertToHtml({ arrayBuffer })
    return String(result.value ?? '').trim()
  }
}
