import { DOMParser as XmlDomParser } from '@xmldom/xmldom'
import { parse } from 'parse5'

const IMAGE_DATA_BYTES_PER_PIXEL = 4

function toPlainText(value: string): string {
  const textNodes: string[] = []
  const parsedDocument = parse(value)
  const pendingNodes: Array<{ childNodes?: unknown[]; nodeName?: string; value?: string }> = [parsedDocument]

  while (pendingNodes.length > 0) {
    const currentNode = pendingNodes.pop()

    if (!currentNode) {
      continue
    }

    if (currentNode.nodeName === '#text' && typeof currentNode.value === 'string') {
      textNodes.push(currentNode.value)
    }

    if (Array.isArray(currentNode.childNodes)) {
      pendingNodes.push(...currentNode.childNodes as Array<typeof currentNode>)
    }
  }

  return textNodes
    .join(' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

class TestDOMParser {
  parseFromString(value: string, mimeType: string) {
    if (mimeType === 'text/html') {
      return {
        body: {
          textContent: toPlainText(value)
        }
      }
    }

    const xmlDocument = new XmlDomParser().parseFromString(value, mimeType)
    const parserErrors = xmlDocument.getElementsByTagName('parsererror')

    return Object.assign(xmlDocument, {
      querySelector(selector: string) {
        if (selector !== 'parsererror') {
          return null
        }

        return parserErrors.length > 0
          ? parserErrors[0]
          : null
      }
    })
  }
}

if (typeof globalThis.DOMParser === 'undefined') {
  globalThis.DOMParser = TestDOMParser as unknown as typeof DOMParser
}

if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {} as unknown as typeof DOMMatrix
}

if (typeof globalThis.DOMRect === 'undefined') {
  globalThis.DOMRect = class DOMRect {
    constructor(
      public x = 0,
      public y = 0,
      public width = 0,
      public height = 0
    ) {}
  } as unknown as typeof DOMRect
}

if (typeof globalThis.Path2D === 'undefined') {
  globalThis.Path2D = class Path2D {} as unknown as typeof Path2D
}

if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = class ImageData {
    readonly colorSpace = 'srgb'
    readonly data: Uint8ClampedArray
    readonly height: number
    readonly width: number

    constructor(dataOrWidth: number | Uint8ClampedArray, widthOrHeight: number, height?: number) {
      if (typeof dataOrWidth === 'number') {
        this.width = dataOrWidth
        this.height = widthOrHeight
        this.data = new Uint8ClampedArray(this.width * this.height * IMAGE_DATA_BYTES_PER_PIXEL)
        return
      }

      this.data = dataOrWidth
      this.width = widthOrHeight
      this.height = height ?? Math.max(1, Math.floor(this.data.length / (this.width * IMAGE_DATA_BYTES_PER_PIXEL)))
    }
  } as unknown as typeof ImageData
}

if (typeof process !== 'undefined' && typeof process.getBuiltinModule === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  process.getBuiltinModule = (module: string) => require(module)
}
