import { Service } from '@freshgum/typedi'
import mammoth from 'mammoth/mammoth.browser.js'

@Service({ id: MammothConversionService.SERVICE_ID }, [])
export class MammothConversionService {
  static readonly SERVICE_ID = 'MammothConversionService'

  async convertToHtml(
    arrayBuffer: ArrayBuffer,
    imageConverter?: (buffer: ArrayBuffer, contentType: string) => Promise<string>
  ): Promise<string> {
    const options: Parameters<typeof mammoth.convertToHtml>[0] = { arrayBuffer }

    if (imageConverter) {
      options.convertImage = async (image) => {
        const buffer = await image.read()
        const src = await imageConverter(buffer, image.contentType)
        return { src }
      }
    }

    const result = await mammoth.convertToHtml(options)
    return String(result.value ?? '').trim()
  }
}
