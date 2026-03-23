import { odtToHtml } from 'odf-kit/reader'
import { Service } from '@freshgum/typedi'
import { MarkdownItService } from './MarkdownItService'

@Service(
  { id: OpenDocumentConversionService.SERVICE_ID },
  [MarkdownItService.SERVICE_ID]
)
export class OpenDocumentConversionService {
  static readonly SERVICE_ID = 'OpenDocumentConversionService'

  constructor(
    private readonly markdownItService: MarkdownItService
  ) {}

  async convertOdtToMarkdown(arrayBuffer: ArrayBuffer): Promise<string> {
    const htmlContent = odtToHtml(new Uint8Array(arrayBuffer))
    return this.markdownItService.htmlToMarkdown(htmlContent).trim()
  }
}
