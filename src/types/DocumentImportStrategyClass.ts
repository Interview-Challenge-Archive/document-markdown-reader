export type DocumentImportStrategyClass = {
  readonly supportedExtensions: ReadonlyArray<string>
  readonly supportedMimeTypes: ReadonlyArray<string>
}
