export abstract class DocumentImportError extends Error {
  readonly code: string

  protected constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = new.target.name
  }
}
