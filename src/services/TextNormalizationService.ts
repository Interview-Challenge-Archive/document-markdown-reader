import { Service } from '@freshgum/typedi'

@Service({ id: TextNormalizationService.SERVICE_ID }, [])
export class TextNormalizationService {
  static readonly SERVICE_ID = 'TextNormalizationService'

  unescapeMarkdownControlCharacters(value: string): string {
    return value.replace(/\\(.)/g, '$1')
  }

  normalizeNewlines(value: string): string {
    return value.replace(/\r\n/g, '\n')
  }
}
