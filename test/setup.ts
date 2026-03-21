import { DOMParser as XmlDomParser } from '@xmldom/xmldom'

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
}

function toPlainText(value: string): string {
  return decodeHtmlEntities(String(value ?? ''))
    .replace(/<[^>]*>/g, ' ')
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
  globalThis.DOMRect = class DOMRect {} as unknown as typeof DOMRect
}

if (typeof globalThis.Path2D === 'undefined') {
  globalThis.Path2D = class Path2D {} as unknown as typeof Path2D
}

if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = class ImageData {} as unknown as typeof ImageData
}

if (typeof process !== 'undefined' && typeof process.getBuiltinModule === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  process.getBuiltinModule = (module: string) => require(module)
}
