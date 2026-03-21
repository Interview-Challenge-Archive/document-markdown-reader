import { Service } from '@freshgum/typedi'
import * as pdfJsModule from 'pdfjs-dist/legacy/build/pdf.mjs'
import type { PdfJsModule } from '../interfaces/PdfJsModule'

@Service({ id: PdfJsService.SERVICE_ID }, [])
export class PdfJsService {
  static readonly SERVICE_ID = 'PdfJsService'

  private readonly pdfJs = pdfJsModule as unknown as PdfJsModule

  getModule(): PdfJsModule {
    return this.pdfJs
  }
}
