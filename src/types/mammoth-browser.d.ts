declare module 'mammoth/mammoth.browser' {
  interface MammothResult {
    value?: string | null
  }

  interface MammothBrowserModule {
    convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>
  }

  const mammoth: MammothBrowserModule
  export default mammoth
}
