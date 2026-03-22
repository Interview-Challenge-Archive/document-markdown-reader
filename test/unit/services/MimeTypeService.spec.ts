import { describe, expect, it } from 'vitest'
import { MimeTypeService } from '../../../src/services/MimeTypeService'
import type { DocumentFileLike } from '../../../src/types/DocumentFileLike'

function createFileLike(type?: string): DocumentFileLike {
  return {
    type,
    async text() {
      return ''
    },
    async arrayBuffer() {
      return new ArrayBuffer(0)
    }
  }
}

describe('MimeTypeService', () => {
  const mimeTypeService = new MimeTypeService()

  it('normalizes mime types', () => {
    expect(mimeTypeService.normalizeMimeType(' Text/HTML; Charset=UTF-8 ')).toBe('text/html')
    expect(mimeTypeService.normalizeMimeType(undefined)).toBe('')
  })

  it('matches normalized mime types against supported values', () => {
    expect(mimeTypeService.matchesMimeType(createFileLike('TEXT/PLAIN; charset=UTF-8'), ['text/plain'])).toBe(true)
    expect(mimeTypeService.matchesMimeType(createFileLike(''), ['text/plain'])).toBe(false)
  })
})
