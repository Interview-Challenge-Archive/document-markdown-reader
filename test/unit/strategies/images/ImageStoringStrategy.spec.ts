import { describe, expect, it } from 'vitest'
import { ImageStoringStrategy } from '../../../../src/strategies/images/ImageStoringStrategy'

class ConcreteImageStoringStrategy extends ImageStoringStrategy {
  async storeImage(_buffer: ArrayBuffer, _contentType: string): Promise<string> {
    return 'stored-image-url'
  }
}

describe('ImageStoringStrategy', () => {
  it('can be extended with a concrete implementation', async () => {
    const strategy = new ConcreteImageStoringStrategy()
    const buffer = new Uint8Array([1, 2, 3]).buffer

    await expect(strategy.storeImage(buffer, 'image/png')).resolves.toBe('stored-image-url')
  })
})
