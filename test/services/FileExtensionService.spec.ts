import { describe, expect, it } from 'vitest'
import { FileExtensionService } from '../../src/services/FileExtensionService'
import type { DocumentFileLike } from '../../src/types/DocumentFileLike'

function createFileLike(name?: string): DocumentFileLike {
  return {
    name,
    async text() {
      return ''
    },
    async arrayBuffer() {
      return new ArrayBuffer(0)
    }
  }
}

describe('FileExtensionService', () => {
  const fileExtensionService = new FileExtensionService()

  it('resolves normalized file extensions', () => {
    expect(fileExtensionService.resolveFileExtension('Report.DOCX')).toBe('docx')
    expect(fileExtensionService.resolveFileExtension('archive.tar.gz')).toBe('gz')
  })

  it('returns empty extension for invalid names', () => {
    expect(fileExtensionService.resolveFileExtension('README')).toBe('')
    expect(fileExtensionService.resolveFileExtension('trailing.')).toBe('')
    expect(fileExtensionService.resolveFileExtension(null)).toBe('')
  })

  it('matches supported extensions against a file', () => {
    expect(fileExtensionService.matchesFileExtension(createFileLike('summary.md'), ['txt', 'md'])).toBe(true)
    expect(fileExtensionService.matchesFileExtension(createFileLike('summary.pdf'), ['txt', 'md'])).toBe(false)
  })
})
