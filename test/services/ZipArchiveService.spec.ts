import { describe, expect, it } from 'vitest'
import { ZipArchiveService } from '../../src/services/ZipArchiveService'

describe('ZipArchiveService', () => {
  const zipArchiveService = new ZipArchiveService()

  it('detects zip signatures', () => {
    expect(zipArchiveService.looksLikeZipArchive(new Uint8Array([0x50, 0x4b, 0x03, 0x04]).buffer)).toBe(true)
    expect(zipArchiveService.looksLikeZipArchive(new Uint8Array([0x50, 0x4b, 0x05, 0x06]).buffer)).toBe(true)
    expect(zipArchiveService.looksLikeZipArchive(new Uint8Array([0x50, 0x4b, 0x07, 0x08]).buffer)).toBe(true)
    expect(zipArchiveService.looksLikeZipArchive(new Uint8Array([0x50, 0x4b, 0x01, 0x02]).buffer)).toBe(false)
    expect(zipArchiveService.looksLikeZipArchive(new Uint8Array([0x50, 0x4b]).buffer)).toBe(false)
  })

  it('creates and loads zip archives', async () => {
    const createdArchive = zipArchiveService.createArchive()
    createdArchive.file('note.txt', 'hello')
    const generated = await createdArchive.generateAsync({ type: 'arraybuffer' })

    const loadedArchive = await zipArchiveService.loadArchive(generated)
    await expect(loadedArchive.file('note.txt')?.async('string')).resolves.toBe('hello')
  })
})
