import { Service } from '@freshgum/typedi'
import JSZip from 'jszip'

@Service({ id: ZipArchiveService.SERVICE_ID }, [])
export class ZipArchiveService {
  static readonly SERVICE_ID = 'ZipArchiveService'

  looksLikeZipArchive(arrayBuffer: ArrayBuffer): boolean {
    const byteView = new Uint8Array(arrayBuffer)

    if (byteView.length < 4) {
      return false
    }

    return byteView[0] === 0x50
      && byteView[1] === 0x4b
      && [0x03, 0x05, 0x07].includes(byteView[2])
      && [0x04, 0x06, 0x08].includes(byteView[3])
  }

  createArchive(): JSZip {
    return new JSZip()
  }

  async loadArchive(arrayBuffer: ArrayBuffer): Promise<JSZip> {
    return await JSZip.loadAsync(arrayBuffer)
  }
}
