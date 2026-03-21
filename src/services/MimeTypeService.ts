import { Service } from '@freshgum/typedi'
import type { DocumentFileLike } from '../types/DocumentFileLike'

@Service({ id: MimeTypeService.SERVICE_ID }, [])
export class MimeTypeService {
  static readonly SERVICE_ID = 'MimeTypeService'

  normalizeMimeType(mimeType: string | null | undefined): string {
    return String(mimeType ?? '')
      .trim()
      .toLowerCase()
      .split(';')[0]
  }

  matchesMimeType(
    file: DocumentFileLike | null | undefined,
    supportedMimeTypes: ReadonlyArray<string>
  ): boolean {
    const normalizedMimeType = this.normalizeMimeType(file?.type)

    if (!normalizedMimeType) {
      return false
    }

    return supportedMimeTypes.includes(normalizedMimeType)
  }
}
