import { parseOffice } from '@jose.espana/docstream'
import { Service } from '@freshgum/typedi'
import { ZipArchiveService } from './ZipArchiveService'

const OPEN_DOCUMENT_TEXT_MIME_TYPE = 'application/vnd.oasis.opendocument.text'

@Service({ id: OpenDocumentConversionService.SERVICE_ID }, [ZipArchiveService.SERVICE_ID])
export class OpenDocumentConversionService {
  static readonly SERVICE_ID = 'OpenDocumentConversionService'

  constructor(
    private readonly zipArchiveService: ZipArchiveService
  ) {}

  async convertOdtToMarkdown(arrayBuffer: ArrayBuffer): Promise<string> {
    const parsedDocument = await parseOffice(arrayBuffer)
    return String(parsedDocument.toMarkdown()).trim()
  }

  async convertFodtToMarkdown(xmlContent: string | null | undefined): Promise<string> {
    const normalizedXmlContent = String(xmlContent ?? '').trim()

    if (!normalizedXmlContent) {
      return ''
    }

    const wrappedArchive = await this.createOdtArchiveFromFlatXml(normalizedXmlContent)
    return await this.convertOdtToMarkdown(wrappedArchive)
  }

  private async createOdtArchiveFromFlatXml(xmlContent: string): Promise<ArrayBuffer> {
    const archive = this.zipArchiveService.createArchive()
    archive.file('mimetype', OPEN_DOCUMENT_TEXT_MIME_TYPE, { compression: 'STORE' })
    archive.file('content.xml', xmlContent)

    return await archive.generateAsync({ type: 'arraybuffer' })
  }
}
