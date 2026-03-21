export interface DocumentFileLike {
  name?: string | null
  type?: string | null
  text(): Promise<string>
  arrayBuffer(): Promise<ArrayBuffer>
}
