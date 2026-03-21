import { Service } from '@freshgum/typedi'
import type { DocumentFileLike } from '../types/DocumentFileLike'

@Service({ id: FileExtensionService.SERVICE_ID }, [])
export class FileExtensionService {
  static readonly SERVICE_ID = 'FileExtensionService'

  resolveFileExtension(fileName: string | null | undefined): string {
    const normalizedFileName = String(fileName ?? '').trim()
    const lastDotIndex = normalizedFileName.lastIndexOf('.')

    if (lastDotIndex <= -1 || lastDotIndex === normalizedFileName.length - 1) {
      return ''
    }

    return normalizedFileName.slice(lastDotIndex + 1).toLowerCase()
  }

  matchesFileExtension(
    file: DocumentFileLike | null | undefined,
    supportedExtensions: ReadonlyArray<string>
  ): boolean {
    return supportedExtensions.includes(this.resolveFileExtension(file?.name))
  }
}
