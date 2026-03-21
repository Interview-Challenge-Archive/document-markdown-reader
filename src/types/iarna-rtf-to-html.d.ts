declare module '@iarna/rtf-to-html' {
  type TemplateFunction = (document: unknown, defaults: unknown, content: string) => string

  type RtfToHtmlOptions = {
    template?: TemplateFunction
  }

  type RtfToHtmlCallback = (error: Error | null, html?: string) => void

  interface RtfToHtmlModule {
    fromString(input: string, callback: RtfToHtmlCallback): void
    fromString(input: string, options: RtfToHtmlOptions, callback: RtfToHtmlCallback): void
  }

  const rtfToHtml: RtfToHtmlModule
  export = rtfToHtml
}
