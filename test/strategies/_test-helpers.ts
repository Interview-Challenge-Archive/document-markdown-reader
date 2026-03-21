import { vi } from 'vitest'
import type { DocumentFileLike } from '../../src/types/DocumentFileLike'

export function createTextFile(
  content: string,
  name: string,
  type: string
): DocumentFileLike {
  return {
    name,
    type,
    async text() {
      return content
    },
    async arrayBuffer() {
      const encoded = new TextEncoder().encode(content)
      return encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength)
    }
  }
}

export function createBinaryFile(
  content: ArrayBuffer,
  name: string,
  type: string
): DocumentFileLike {
  return {
    name,
    type,
    async text() {
      return new TextDecoder().decode(content)
    },
    async arrayBuffer() {
      return content.slice(0)
    }
  }
}

type ZipEntry = {
  async: (type: 'string' | 'arraybuffer') => Promise<string | ArrayBuffer>
}

export function createZipArchive(entries: Record<string, ZipEntry>) {
  return {
    file: vi.fn((pattern: RegExp) => Object.entries(entries)
      .filter(([entryPath]) => pattern.test(entryPath))
      .map(([, entry]) => entry))
  }
}
