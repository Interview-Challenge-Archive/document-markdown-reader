import { ImageStoringStrategy } from './ImageStoringStrategy'

export class DataUrlImageStoringStrategy extends ImageStoringStrategy {
  async storeImage(buffer: ArrayBuffer, contentType: string): Promise<string> {
    const bytes = new Uint8Array(buffer)
    let binary = ''

    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }

    return `data:${contentType};base64,${btoa(binary)}`
  }
}
