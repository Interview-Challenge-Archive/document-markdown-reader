declare module 'mammoth/mammoth.browser.js' {
  interface MammothResult {
    value?: string | null
  }

  interface MammothImage {
    read(): Promise<ArrayBuffer>
    contentType: string
  }

  interface MammothConvertOptions {
    arrayBuffer: ArrayBuffer
    convertImage?: (image: MammothImage) => Promise<{ src: string }>
  }

  interface MammothBrowserModule {
    convertToHtml(input: MammothConvertOptions): Promise<MammothResult>
    images: {
      imgElement(
        convert: (image: MammothImage) => Promise<{ src: string }>
      ): (image: MammothImage) => Promise<{ src: string }>
    }
  }

  const mammoth: MammothBrowserModule
  export default mammoth
}
