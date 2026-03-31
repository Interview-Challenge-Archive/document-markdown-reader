export abstract class ImageStoringStrategy {
  abstract storeImage(buffer: ArrayBuffer, contentType: string): Promise<string>
}
