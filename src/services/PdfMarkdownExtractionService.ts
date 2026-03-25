import { Service } from '@freshgum/typedi'
import { InvalidPdfError } from '../errors/InvalidPdfError'
import { UnreadablePdfError } from '../errors/UnreadablePdfError'
import type { PdfDocumentProxy } from '../interfaces/PdfDocumentProxy'
import type { PdfJsModule } from '../interfaces/PdfJsModule'
import type { PdfPageTextItem } from '../interfaces/PdfPageTextItem'
import { PdfJsService } from './PdfJsService'

type PositionedText = {
  text: string
  x: number
  y: number
  width: number
}

type PdfLoadOptions = Record<string, unknown>

@Service({ id: PdfMarkdownExtractionService.SERVICE_ID }, [PdfJsService.SERVICE_ID])
export class PdfMarkdownExtractionService {
  static readonly SERVICE_ID = 'PdfMarkdownExtractionService'

  constructor(
    private readonly pdfJsService: PdfJsService
  ) {}

  /**
   * @throws {InvalidPdfError} When the PDF file is invalid or corrupted
   * @throws {UnreadablePdfError} When the PDF file content cannot be read or contains no text
   */
  async extractMarkdown(arrayBuffer: ArrayBuffer): Promise<string> {
    const pdfJs: PdfJsModule = this.pdfJsService.getModule()
    this.configureBrowserWorkerIfNeeded(pdfJs)
    const pdfBytes = this.clonePdfBytes(arrayBuffer)

    try {
      return await this.extractMarkdownWithOptions(pdfJs, this.createBaseLoadOptions(pdfBytes))
    } catch (error) {
      if (error instanceof UnreadablePdfError) {
        if (this.shouldRetryUnreadableWithPdfJsAssets()) {
          try {
            return await this.extractMarkdownWithOptions(pdfJs, {
              ...this.createBaseLoadOptions(pdfBytes),
              ...this.createPdfJsAssetLoadOptions(pdfJs)
            })
          } catch (retryError) {
            if (retryError instanceof UnreadablePdfError) {
              throw retryError
            }
          }
        }

        throw error
      }

      if (this.shouldRetryWithPdfJsAssets(error)) {
        try {
          const assetLoadOptions = this.createPdfJsAssetLoadOptions(pdfJs)
          return await this.extractMarkdownWithOptions(pdfJs, {
            ...this.createBaseLoadOptions(pdfBytes),
            ...assetLoadOptions
          })
        } catch (retryError) {
          if (retryError instanceof UnreadablePdfError) {
            throw retryError
          }

          throw this.createInvalidPdfError(retryError)
        }
      }

      throw this.createInvalidPdfError(error)
    }
  }

  private createInvalidPdfError(cause: unknown): InvalidPdfError {
    const invalidPdfError = new InvalidPdfError()
    ;(invalidPdfError as Error & { cause?: unknown }).cause = cause
    return invalidPdfError
  }

  private clonePdfBytes(arrayBuffer: ArrayBuffer): Uint8Array {
    return new Uint8Array(arrayBuffer.slice(0))
  }

  private createBaseLoadOptions(pdfBytes: Uint8Array): PdfLoadOptions {
    return {
      data: pdfBytes.slice(),
      useSystemFonts: true
    }
  }

  private createPdfJsAssetLoadOptions(pdfJs: PdfJsModule): PdfLoadOptions {
    const version = this.resolvePdfJsVersion(pdfJs)
    const assetBaseUrl = this.ensureTrailingSlash(`https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/`)

    return {
      cMapUrl: `${assetBaseUrl}cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `${assetBaseUrl}standard_fonts/`,
      wasmUrl: `${assetBaseUrl}wasm/`
    }
  }

  private ensureTrailingSlash(urlValue: string): string {
    return urlValue.endsWith('/') ? urlValue : `${urlValue}/`
  }

  private resolvePdfJsVersion(pdfJs: PdfJsModule): string {
    const version = String(pdfJs?.version ?? '').trim()
    return version || '5.5.207'
  }

  private configureBrowserWorkerIfNeeded(pdfJs: PdfJsModule): void {
    if (typeof window === 'undefined' || !pdfJs.GlobalWorkerOptions) {
      return
    }

    const currentWorkerSrc = String(pdfJs.GlobalWorkerOptions.workerSrc ?? '').trim()
    if (currentWorkerSrc) {
      return
    }

    const version = this.resolvePdfJsVersion(pdfJs)
    pdfJs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/legacy/build/pdf.worker.min.mjs`
  }

  private shouldRetryUnreadableWithPdfJsAssets(): boolean {
    return typeof window !== 'undefined'
  }

  private shouldRetryWithPdfJsAssets(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false
    }

    return /standardFontDataUrl|cMapUrl|wasmUrl|Unable to load (?:font data|(?:binary )?CMap|wasm data)/i.test(error.message)
  }

  private async extractMarkdownWithOptions(pdfJs: PdfJsModule, options: PdfLoadOptions): Promise<string> {
    let pdfDocument: PdfDocumentProxy | undefined

    try {
      const loadingTask = pdfJs.getDocument(options)
      pdfDocument = await loadingTask.promise
      const pageTexts: string[] = []

      for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
        const page = await pdfDocument.getPage(pageNumber)
        const textContent = await page.getTextContent()
        const pageText = this.renderPageText(textContent.items)

        if (pageText) {
          pageTexts.push(pageText)
        }
      }

      const extractedText = pageTexts.join('\n\n').trim()

      if (!extractedText) {
        throw new UnreadablePdfError()
      }

      return extractedText
    } finally {
      try {
        await pdfDocument?.destroy?.()
      } catch {
        // ignore cleanup failures
      }
    }
  }

  private renderPageText(items: PdfPageTextItem[]): string {
    const positionedItems: PositionedText[] = items
      .map((item) => this.toPositionedText(item))
      .filter((item): item is PositionedText => Boolean(item))

    if (!positionedItems.length) {
      return ''
    }

    const groupedLines = this.groupIntoLines(positionedItems)
    return this.joinLines(groupedLines)
  }

  private toPositionedText(item: PdfPageTextItem): PositionedText | null {
    const text = String(item?.str ?? '')
    if (!text.trim()) {
      return null
    }

    const transform = Array.isArray(item?.transform) ? item.transform : []
    const x = Number(transform[4] ?? 0)
    const y = Number(transform[5] ?? 0)
    const width = Number(item?.width ?? 0)

    return {
      text,
      x,
      y,
      width
    }
  }

  private groupIntoLines(positionedItems: PositionedText[]): Array<{ y: number; text: string }> {
    const sortedItems = [...positionedItems]
      .sort((leftItem, rightItem) => rightItem.y - leftItem.y || leftItem.x - rightItem.x)

    const lineGroups: Array<{ y: number; items: PositionedText[] }> = []

    for (const item of sortedItems) {
      const lastLine = lineGroups[lineGroups.length - 1]

      if (!lastLine || Math.abs(lastLine.y - item.y) > 2) {
        lineGroups.push({
          y: item.y,
          items: [item]
        })
        continue
      }

      lastLine.items.push(item)
    }

    return lineGroups.map((lineGroup) => ({
      y: lineGroup.y,
      text: this.renderLine(lineGroup.items)
    }))
  }

  private renderLine(items: PositionedText[]): string {
    const sortedItems = [...items].sort((leftItem, rightItem) => leftItem.x - rightItem.x)
    let renderedLine = ''
    let lastRightEdge = 0

    for (const item of sortedItems) {
      const approximateGap = item.x - lastRightEdge

      if (approximateGap > 4) {
        renderedLine += ' '.repeat(Math.max(1, Math.round(approximateGap / 4)))
      }

      renderedLine += item.text
      lastRightEdge = item.x + Math.max(item.width, item.text.length * 3.5)
    }

    return renderedLine.trimEnd()
  }

  private joinLines(lines: Array<{ y: number; text: string }>): string {
    const renderedLines: string[] = []

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]

      if (!line.text) {
        continue
      }

      if (index > 0) {
        const previousLine = lines[index - 1]
        const verticalGap = previousLine.y - line.y

        if (verticalGap > 18) {
          renderedLines.push('')
        }
      }

      renderedLines.push(line.text)
    }

    return renderedLines.join('\n').trim()
  }
}
